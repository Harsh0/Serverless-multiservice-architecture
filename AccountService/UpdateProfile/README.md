## Update Profile

User can update profile

**URL** : `/account/updateprofile`

**Method** : `POST`

**Auth required** : YES

**Data constraints**

```json
{
    "firstName": "[firstname]",
    "lastName": "[lastname]"
}
```

**Data example**

```json
{
    "firstName": "John",
    "lastName": "Doe"
}
```

### Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "message": "Profile updated Successfully"
}
```

### Error Response

**Condition** : If fields missing

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
    "message":"Fields are missing"
}
```

**Condition** : If server side error

**Code** : `500 Internal Server Error`

**Content** :

```json
{
    "message":"Error updating profile"
}
```
