from rest_framework import serializers
from users.models import User
from rest_framework.serializers import ValidationError

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(required=True, max_length = 120, write_only = True)
    repeat_password = serializers.CharField(required=True, max_length = 120, write_only = True)
    
    class Meta: 
        model = User
        fields = ('first_name', 'last_name', 'username', 'email', 'password', 'repeat_password')
        # To ensure protection for users 
        extra_kwargs = {'password': {'write_only': True}, 'repeat_password': {'write_only': True}}
        
    def validate(self, data):
        '''
        Checks if the values that are entered into the fields by user are valid. 
        Return a dictionary storing all values. Throw ValidationError if at least one
        field is not valid. 
        '''
        # 1. Check first_name, last_name, email, password, and repeat_password are in data
        if ("email" in data and "username" in data and "password" in data and "repeat_password" in data 
            and "first_name" in data and "last_name" in data):
            # Update data so it only contains the 5 fields above
            first_name = data["first_name"]
            last_name = data["last_name"]
            username = data["username"]
            password = data["password"] 
            repeat_password = data["repeat_password"]
            email = data["email"] 
            data = {'password': password, 'username': username, 'repeat_password': repeat_password, 'email': email, 
                            'first_name': first_name, 'last_name': last_name}
            errors = {}
            # 2. The password fields don't match
            if password != repeat_password:
                errors['repeat_password'] = 'The passwords doesn\'t match'
            # 2.5 Password length is less than 6 characters 
            if len(password) < 6: 
                errors['password'] = 'The password is too short. Enter a password that is at least 6 characters'
            # 3. A user with that email already exists in the database
            if User.objects.filter(email=email).exists():
                # QuerySet is not empty
                errors['email'] = 'Email has been taken'
            # 3.5 A user with that username already exists in the database 
            if User.objects.filter(username=username).exists():
                # QuerySet is not empty
                errors['username'] = 'Username has been taken'
                
            # 4. Enter a valid email address
            if '@' not in email:
                errors['email'] = 'Enter a valid email address'
                
            # Check if errors dictionary is empty or not
            if len(errors) != 0: 
                raise ValidationError(errors)
            
            # Remove repeat_password from data
            data.pop("repeat_password")
        return data
    

class SignInSerializer(serializers.ModelSerializer):
    email = serializers.CharField(required=True)
    password = serializers.CharField(required=True)
    
    class Meta: 
        model = User
        fields = ('email', 'password')
        # To ensure protection for users 
        extra_kwargs = {'password': {'write_only': True}}
        
    def validate(self, data):
        '''
        Checks if the values that are entered into the fields by user are valid. 
        Return a dictionary storing all values. Throw ValidationError if at least one
        field is not valid. 
        '''
        # 1. Check if email and password are in data
        if ("email" in data and "password" in data):
            # Update data so it only contains the 5 fields above
            email = data["email"] 
            password = data["password"]
            data = {'email': email, 'password': password}
            errors = {}
            # Check if a valid email address was entered
            if '@' not in email:
                errors['email'] = 'Enter a valid email address'
            # Check if there exists a user in the database with that email and password 
            if User.objects.filter(email=email).exists():
                # Attempt to authenticate email and password 
                found_user = User.objects.filter(email=email).first()
                if found_user is not None and found_user.password != password:
                    errors['password'] = 'Password is invalid'
            else: 
                errors['email'] = 'This user doesn\'t exist or the email or password is invalid'
            # Check if errors dictionary is empty or not
            if len(errors) != 0: 
                raise ValidationError(errors)
        return data
    
class UserProfileSerializer(serializers.ModelSerializer):
    password = serializers.CharField(required=False, write_only = True)
    
    class Meta: 
        model = User
        fields = ('first_name', 'last_name', 'username', 'email', 'password')
        # To ensure protection for users 
        extra_kwargs = {'password': {'write_only': True}}
        
    def validate(self, data):
        '''
        Checks if the values that are entered into the fields by user are valid. 
        Return a dictionary storing all values. Throw ValidationError if at least one
        field is not valid. 
        '''
        errors = {}
        filtered_data = {} # Filtered data (incase extra keys-value pairs are added in)
        # Check first name
        if "first_name" in data: 
            if data["first_name"] == "": 
                errors["first_name"] = "First name can't be blank"
            else:
                filtered_data["first_name"] = data["first_name"]
        # Check last name
        if "last_name" in data:
            if data["last_name"] == "":
                errors["last_name"] = "First name can't be blank"
            else:
                filtered_data["last_name"] = data["last_name"]
        # Check Email  
        if 'email' in data:
            email = data["email"] 
            # Check if the email is valid
            if email == "" or '@' not in email:
                errors['email'] = "Enter a valid email address"
            else:
                filtered_data['email'] = email
        # Check username 
        if "username" in data: 
            username = data["username"]
            if data["username"] == "":
                errors["username"] = "Username can't be blank"
            else:
                filtered_data["username"] = username
        # Check password 
        if "password" in data: 
            if len(data["password"]) < 6 and len(data["password"]) != 0: 
                errors["password"] = 'The password is too short. Enter a password that is at least 6 characters'
            elif len(data["password"]) != 0: 
                filtered_data["password"] = data["password"]
        # Check if errors dictionary is empty or not
        if len(errors) != 0: 
            raise ValidationError(errors)
        return filtered_data