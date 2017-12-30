## Update Profile

User can update profile

**URL** : `/account/getprofile`

**Method** : `GET`

**Auth required** : YES

### Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "message": "Success",
    "profile": {
        "username": "John",
        "firstName": "John",
        "lastName": "Doe"
    }
}
```

### Error Response

**Condition** : If server side error

**Code** : `500 Internal Server Error`

**Content** :

```json
{
    "message":"Error getting profile"
}
```
