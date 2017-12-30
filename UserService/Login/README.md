## Login

User can login and get token

**URL** : `/user/login`

**Method** : `POST`

**Auth required** : NO

**Data constraints**

```json
{
    "username": "[valid username]",
    "password": "[valid password]"
}
```

**Data example**

```json
{
    "username": "John",
    "password": "john'spassword"
}
```

### Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "message": "Login Successful",
    "token": "bjbsdjkhishiu98y87d678678dcyds"
}
```

### Error Response

**Condition** : If fields are missing

**Code** : `400 BAD Request`

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
    "message":"Error Login"
}
```

