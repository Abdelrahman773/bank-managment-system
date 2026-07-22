from marshmallow import Schema, fields




class RegisterSchema(Schema):
    username = fields.Str(required=True)
    firstName    = fields.Str(required=True)
    lastName = fields.Str(required=True)
    email = fields.Email(required=True)
    password = fields.Str(required=True)
    nationalId = fields.Str(required=True)
    dateOfBirth = fields.Date(required=True)
    phonenumber = fields.Str(required=True)


class LoginSchema(Schema):
    username = fields.Str(required=True)
    password = fields.Str(required=True)

