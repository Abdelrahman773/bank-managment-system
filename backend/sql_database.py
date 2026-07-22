from mysql.connector.pooling import MySQLConnectionPool
import bcrypt


class DBManager():
    def __init__(self, host, user, password, database):
        self.pool = None
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.ConnectToDB()

    def ConnectToDB(self):
        self.pool = MySQLConnectionPool(
            pool_name="mypool",
            pool_size=5,
            host=self.host,
            user=self.user,
            password=self.password,
            database=self.database
        )

    def get_connection(self):
        return self.pool.get_connection()

    def hashingPassword(self, password):
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), salt)
        return hashed_password

    def register(self, username, email, password, firstname, lastname, national_id, phone_number, address,
                 date_of_birth):
        hashed_password = self.hashingPassword(password)
        reg_sql = """
        INSERT INTO users (
            username,
            email,
            password,
            firstname,
            lastname,
            national_id,
            phone_number,
            Address,
            date_of_birth
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            cursor.execute(
                reg_sql,
                (
                    username,
                    email,
                    hashed_password,
                    firstname,
                    lastname,
                    national_id,
                    phone_number,
                    address,
                    date_of_birth
                )
            )
            conn.commit()
            cursor.close()
            conn.close()
            return True

        except Exception as e:
            print(e)
            return False

    def Login(self, username, password):
        conn = self.get_connection()
        cursor = conn.cursor()
        login_sql = """
        SELECT id, password FROM users WHERE username = %s
        """

        cursor.execute(login_sql, (username,))
        result = cursor.fetchone()

        if result is None:
            cursor.close()
            conn.close()
            return False, None

        user_id, db_password = result

        hashed_password = db_password

        if bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8")):
            cursor.close()
            conn.close()
            return True, user_id

        cursor.close()
        conn.close()
        return False, None

    def get_balance(self, username):
        conn = self.get_connection()
        cursor = conn.cursor()
        balance_sql = """
                SELECT AccountBalance FROM users WHERE username = %s
                """
        cursor.execute(balance_sql, (username,))
        balance = cursor.fetchone()[0]
        cursor.close()
        conn.close()
        if balance is None:
            return None
        return balance

    def get_username(self, user_id):
        conn = self.get_connection()
        cursor = conn.cursor()
        username_sql = "SELECT username FROM users WHERE id = %s"
        cursor.execute(username_sql, (user_id,))
        result = cursor.fetchone()

        cursor.close()
        conn.close()

        if result is None:
            return False, None

        return True, result[0]

    def update_balance(self, username, balance):
        update_balance_sql = """
        UPDATE users
        SET AccountBalance = %s
        WHERE username = %s
        """
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            cursor.execute(update_balance_sql, (balance, username,))
            conn.commit()
            cursor.close()
            conn.close()
        except Exception as err:
            print(err)

    def deposit(self, username, balance):
        try:
            current_balance = self.get_balance(username)
            new_balance = current_balance + balance
            self.update_balance(username, new_balance)
            return True
        except Exception as err:
            print(err)
            return False

    def save_transactions(self, sender_username, receiver_username, transferred_balance, user_id):
        try:
            transaction_type = ["in","out"]
            conn = self.get_connection()
            cursor = conn.cursor()
            save_transaction_sql = """
            INSERT INTO Transactions (
                    to_username,
                    from_username,
                    transfared_balance,
                    user_id,
                    type

                )
            VALUES (%s, %s, %s,%s,%s)
            """
            for i in range(2):
                cursor.execute(
                    save_transaction_sql,
                    (
                        receiver_username,
                        sender_username,
                        transferred_balance,
                        user_id,
                        transaction_type[i]

                    )
                )
            conn.commit()
            cursor.close()
            conn.close()
            return True
        except Exception as err:
            print(err)
            return False

    def withdraw(self, username, balance):
        try:
            current_balance = self.get_balance(username)
            if current_balance >= balance:
                new_balance = current_balance - balance
                self.update_balance(username, new_balance)
                return True
            return False
        except Exception as err:
            print(err)
            return False

    def transfer(self, from_username, receiver_username, transferred_balance):
        try:
            if self.deposit(receiver_username, transferred_balance) and self.withdraw(from_username,
                                                                                      transferred_balance):
                return True
            return False
        except Exception as err:
            print(err)
            return False

    def get_transactions(self, from_username):
        try:
            conn = self.get_connection()
            cursor = conn.cursor()
            transactions_sql = """
            select * from Transactions where from_username = %s and type = "out"
            union 
            select * from Transactions where to_username = %s and type = "in"       
            """
            transactions_list = []
            cursor.execute(transactions_sql, (from_username,from_username))
            rows = cursor.fetchall()
            if rows is None:
                cursor.close()
                conn.close()
                return None
            for row in rows:
                transactions_dict = {}
                transactions_dict["to_username"] = row[1]
                transactions_dict["from_username"] = row[2]
                transactions_dict["transfared_balance"] = float(row[3])
                transactions_list.append(transactions_dict)
            cursor.close()
            conn.close()
            return transactions_list
        except Exception as err:
            print(err)

    def get_firstname(self,user_id):
        conn = self.get_connection()
        cursor = conn.cursor()
        firstname_sql = "SELECT firstname FROM users WHERE id = %s"
        cursor.execute(firstname_sql, (user_id,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        if result is None:
            return False, None

        return True, result[0]