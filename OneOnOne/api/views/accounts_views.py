from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response 
from rest_framework import generics
from rest_framework import views
from ..serializer.auth_serializer import RegisterSerializer, SignInSerializer, UserProfileSerializer, DeleteProfileSerializer
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from users.models import User
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404



class SignUpView(generics.CreateAPIView): 
    # Set the permission for this view 
    # Referenced code from https://www.django-rest-framework.org/api-guide/permissions/
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
    
    def get(self, request):
        return Response(status=status.HTTP_200_OK)
    
    def post(self, request):        
        ''' Sends information inputted to the server. It would validate data it recieves from the user. 
        '''
        # Referenced https://code.tutsplus.com/how-to-authenticate-with-jwt-in-django--cms-30460t
        the_serializer = self.serializer_class(data = request.data)
        # Check if the information provided is valid 
        the_serializer.is_valid(raise_exception=True)
        # Create new user 
        the_serializer.save()
        return Response(the_serializer.data, status=status.HTTP_201_CREATED)
    
    
class SignInView(views.APIView): 
    # Set the permission for this view 
    permission_classes = [AllowAny]
    serializer_class = SignInSerializer
    
    def get(self, request):
        return Response(status=status.HTTP_200_OK)
    
    def post(self, request):        
        ''' Sends information inputted to the server. It would validate data it recieves from the user. 
        '''
        the_serializer = self.serializer_class(data = request.data)
        # Check if the information provided is valid 
        the_serializer.is_valid(raise_exception=True)

        # Create a new token for user
        # Referenced code from https://django-rest-framework-simplejwt.readthedocs.io/en/latest/creating_tokens_manually.html
        # If the code reaches here email and password is assumed to be valid and there exists a User with that email and password
        curr_user = User.objects.filter(email=the_serializer.validated_data["email"]).first()
        refresh = RefreshToken.for_user(curr_user)
        return Response({'refresh': str(refresh), 'access': str(refresh.access_token), 'user_id': curr_user.pk,})

class ProfileUpdate(generics.RetrieveUpdateAPIView):
    # Set the permission for this view 
    permission_classes = [IsAuthenticated]
    serializer_class = UserProfileSerializer
    
    def get(self, request):
        '''Get user info'''
        return Response(self.serializer_class(request.user).data, status=status.HTTP_200_OK)
    
    def get_object(self):
        obj = get_object_or_404(User, pk = self.kwargs["pk"])
        if obj == self.request.user:
            return obj
        raise PermissionDenied('You can\'t view this profile')
    
    def update(self, request):
        # Create an instance with user's info and changes from request
        the_serializer = self.serializer_class(request.user, data=request.data, partial=True)
        the_serializer.is_valid(raise_exception=True)
        the_serializer.save()
        return Response(the_serializer.data, status=status.HTTP_200_OK)
    
class DeleteProfile(generics.DestroyAPIView):
    # Set the permission for this view 
    permission_classes = [IsAuthenticated]
    serializer_class = DeleteProfileSerializer
    
    def destroy(self, request, *args, **kwargs):
        # Check if authorized to delete 
        obj = get_object_or_404(User, pk = request.user.pk)
        if obj != request.user:
            raise PermissionDenied('You can\'t delete this profile.')
        else:
            # Delete the profile
            self.perform_destroy(obj)
            return Response(status=status.HTTP_204_NO_CONTENT)