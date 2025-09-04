from rest_framework import serializers
from .models import JobListing, SearchResult, GPSCoordinates, OperatingHours, SearchResultType

# Job Listing Serializers
class JobListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobListing
        fields = [
            'job_position',
            'job_link',
            'job_id',
            'company_name',
            'company_profile',
            'job_location',
            'job_posting_date',
            'company_logo_url'
        ]
        read_only_fields = ['job_id']

    def validate_job_id(self, value):
        """Ensure job_id is unique"""
        if JobListing.objects.filter(job_id=value).exists():
            raise serializers.ValidationError("A job with this ID already exists.")
        return value

# Google Maps Search Results Serializers
class GPSCoordinatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = GPSCoordinates
        fields = ['latitude', 'longitude']

class OperatingHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = OperatingHours
        fields = [
            'monday', 'tuesday', 'wednesday', 'thursday', 
            'friday', 'saturday', 'sunday'
        ]

class SearchResultTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchResultType
        fields = ['type_name']

class SearchResultSerializer(serializers.ModelSerializer):
    gps_coordinates = GPSCoordinatesSerializer()
    operating_hours = OperatingHoursSerializer(required=False, allow_null=True)
    types = SearchResultTypeSerializer(many=True, read_only=True)
    
    class Meta:
        model = SearchResult
        fields = [
            'title', 'place_id', 'data_id', 'data_cid', 'reviews_link', 
            'photos_link', 'posts_link', 'gps_coordinates', 'provider_id',
            'rating', 'reviews', 'type', 'types', 'address', 'open_state',
            'hours', 'operating_hours', 'phone', 'website', 'thumbnail',
            'image', 'google_maps_url', 'unclaimed_business'
        ]
        read_only_fields = ['place_id']

    def create(self, validated_data):
        gps_data = validated_data.pop('gps_coordinates')
        operating_hours_data = validated_data.pop('operating_hours', None)
        types_data = validated_data.pop('types', [])
        
        # Create GPS coordinates
        gps_coordinates = GPSCoordinates.objects.create(**gps_data)
        
        # Create operating hours if provided
        operating_hours = None
        if operating_hours_data:
            operating_hours = OperatingHours.objects.create(**operating_hours_data)
        
        # Create search result
        search_result = SearchResult.objects.create(
            gps_coordinates=gps_coordinates,
            operating_hours=operating_hours,
            **validated_data
        )
        
        # Create types
        for type_data in types_data:
            SearchResultType.objects.create(
                search_result=search_result,
                type_name=type_data['type_name']
            )
        
        return search_result

    def update(self, instance, validated_data):
        # Handle nested updates
        gps_data = validated_data.pop('gps_coordinates', None)
        operating_hours_data = validated_data.pop('operating_hours', None)
        types_data = validated_data.pop('types', None)
        
        # Update GPS coordinates
        if gps_data:
            for attr, value in gps_data.items():
                setattr(instance.gps_coordinates, attr, value)
            instance.gps_coordinates.save()
        
        # Update operating hours
        if operating_hours_data:
            if instance.operating_hours:
                for attr, value in operating_hours_data.items():
                    setattr(instance.operating_hours, attr, value)
                instance.operating_hours.save()
            else:
                operating_hours = OperatingHours.objects.create(**operating_hours_data)
                instance.operating_hours = operating_hours
        
        # Update types if provided
        if types_data is not None:
            # Delete existing types
            instance.types.all().delete()
            # Create new types
            for type_data in types_data:
                SearchResultType.objects.create(
                    search_result=instance,
                    type_name=type_data['type_name']
                )
        
        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance

class SearchResultsResponseSerializer(serializers.Serializer):
    search_results = SearchResultSerializer(many=True)