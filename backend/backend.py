import os
from flask import Flask, request,jsonify
from sql_database import DBManager
from flask_cors import CORS
from dotenv import load_dotenv
from Validation import RegisterSchema,LoginSchema
from marshmallow import ValidationError
from datetime import timedelta
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity


class FlaskApi():
    def __init__(self, host, user, password, database):
        self.db = DBManager(host, user, password, database)
        self.db.ConnectToDB()
        self.app = Flask(__name__)
        CORS(self.app, origins=["http://localhost:5173"])
        self.app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
        self.app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")
        self.app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

        self.jwt = JWTManager(self.app)
        self.app.add_url_rule("/login", view_func=self.flask_login, methods=["POST"])
        self.app.add_url_rule("/register", view_func=self.flask_reg, methods=["POST"])
        self.app.add_url_rule("/dashboard", view_func=self.flask_dashboard,methods=["GET"])
        self.app.add_url_rule("/transfer", view_func=self.flask_transfer,methods=["POST"])
        self.app.add_url_rule("/get_transactions", view_func=self.flask_get_transactions,methods=["GET"])
        self.app.add_url_rule("/get_deposit", view_func=self.flask_get_deposit,methods=["POST"])
        self.app.add_url_rule("/get_withdraw", view_func=self.flask_get_withdraw,methods=["POST"])


    def flask_login(self):
        login_data = request.get_json()
        try:
            data = LoginSchema().load(login_data)
            username = data["username"]
            password = data["password"]
            db_result,user_id = self.db.Login(username, password)
            if db_result:
                token = create_access_token(identity=str(user_id))
                return jsonify({"message": "Login successful","token":token}), 200
            else:
                return jsonify({"message": "Invalid credentials"}), 404

        except ValidationError as err:
            return jsonify({"message": err}), 400

    def flask_reg(self):
        reg_data = request.get_json(silent=True)
        try:
            data = RegisterSchema().load(reg_data)
            db_result = self.db.register(
                data["username"],
                data["email"],
                data["password"],
                data["firstName"],
                data["lastName"],
                data["nationalId"],
                data["phonenumber"],
                "123 Giza station",
                data["dateOfBirth"]
            )
            if db_result:
                return jsonify({"message": "Register successful"}), 200
            else:
                return jsonify({"message": "Register fail"}), 404
        except ValidationError as err:
            return jsonify({"errors": err.messages}), 400

    @jwt_required()
    def flask_dashboard(self):
            try:
                user_id = get_jwt_identity()
                db_result, username = self.db.get_username(user_id)
                firstname_result, first_name = self.db.get_firstname(   user_id)
                print(first_name)
                if db_result and firstname_result:
                    balance = self.db.get_balance(username)
                    return jsonify({
                        "user_id": user_id,
                        "username": username,
                        "firstname":first_name,
                        "balance": balance,
                    }), 200
                return jsonify({
                    "message":"user wasn't found"
                }), 404
            except Exception as err:
                print(err)
                return jsonify({
                    "message":"Unexpected error occured"
                }), 400

    @jwt_required()
    def flask_transfer(self):
        try:
            user_id = get_jwt_identity()
            transfer_data = request.get_json(silent=True)
            sender_username, receiver_username, transferred_balance = transfer_data["sender_username"], transfer_data[
                "receiver_username"], transfer_data["transferred_balance"]
            if self.db.transfer(sender_username, receiver_username, transferred_balance) and self.db.save_transactions(
                    sender_username, receiver_username, transferred_balance, user_id):
                return jsonify({
                    "message": "Transfer occured succesfully"
                }), 200
            return jsonify({
                "message": "Unexpected error occured"
            }), 400
        except:
            return jsonify({
                "message": "Unexpected error occured"
            }), 400


    @jwt_required()
    def flask_get_transactions(self):
        try:
            user_id = get_jwt_identity()
            from_username = self.db.get_username(user_id)[1]
            transactions_list = self.db.get_transactions(from_username)
            if transactions_list:
                return jsonify({
                    "transactions": transactions_list
                }), 200
            return jsonify({
                "message": "Unexpected error occurred"
            }), 400
        except Exception as err:
            print(err)
            return jsonify({
                "message": "Unexpected error occurred"
            }), 400

    @jwt_required()
    def flask_get_deposit(self):
        try:
            user_id = get_jwt_identity()
            balance = request.get_json(silent=True)["balance"]
            username = self.db.get_username(user_id)[1]
            if self.db.deposit(username,balance):
                return jsonify({
                    "message": "Deposit completed successfully"
                }), 200
            return jsonify({
                "message": "Unexpected error occurred"
            }), 400
        except:
            return jsonify({
                "message": "Unexpected error occurred"
            }), 400

    @jwt_required()
    def flask_get_withdraw(self):
        try:
            user_id = get_jwt_identity()
            balance = request.get_json(silent=True)["amount"]
            username = self.db.get_username(user_id)[1]
            if self.db.withdraw(username, balance):
                return jsonify({
                    "message": "Withdraw completed successfully"
                }), 200
            return jsonify({
                "message": "Unexpected error occurred"
            }), 400
        except:
            return jsonify({
                "message": "Unexpected error occurred"
            }), 400

    def run(self):
        self.app.run(debug=True)


if __name__ == "__main__":
    load_dotenv()
    host = os.environ.get("HOST")
    user = os.environ.get("USER")
    password = os.environ.get("PASSWORD")
    db_name = os.environ.get("DATABASE")

    api = FlaskApi(host, user, password, db_name)
    api.run()
