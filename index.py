# -*- coding: utf-8 -*-
"""
Created on Tue Mar 27 09:50:39 2018

@author: RG
"""
from flask import Flask,render_template,jsonify,json,session,request,redirect,url_for
from flask_sqlalchemy import SQLAlchemy
import os


x =0
y=0
z = ""
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///Database/UsersAndOrders.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Users(db.Model):
    id = db.Column(db.Integer,unique = True)
    mobile = db.Column(db.String(15),primary_key=True)
    email = db.Column(db.String(100))
    books = db.relationship('OrderDetails',backref='user')
    
    def __repr__():
    	return "<Users( mobile='%s',email='%s')"%(self.mobile,self.email)

   
class OrderDetails(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    bookName = db.Column(db.String(100))
    price = db.Column(db.Float)
    Quantity = db.Column(db.Integer)
    Amount = db.Column(db.Float)
    User_Mobile = db.Column(db.String(15),db.ForeignKey('users.mobile'))

 
db.create_all()

SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
json_url = os.path.join(SITE_ROOT, "static", "catalog.json")
data = json.load(open(json_url))

@app.route('/SessionClear')
def clearSession():
    session.clear()
    return ""

def sessionClear():
    session.clear()
    return

@app.route('/addBooks/<bookId>')
def addBooksToSession(bookId):
    global x
    x=0
    if bookId not in session:
        session[bookId] = str(0)
    return ""
    

@app.route('/noOfBooks/<bookId>')
def noOfBooks(bookId):
    a={}
    global y
    global z
    y = 3

    if bookId!=z:
        z = bookId
        value =1
    elif x%y == 0 and x !=0 and bookId == z:
        value = y +1
    else :
        value = 1
    a[bookId] = value
    return jsonify(a)


@app.route('/addToCart/<bookId>')
def addToCart(bookId):
    global x
    v = ""
    if bookId in session and session[bookId]< str(3) :
        if x>=15:
            x = 15
        else:
            x+=1
        v = session[bookId]
        session[bookId] = str(int(v)+ 1)
    return  ""

@app.route('/BooksInCart')
def BooksInCart():
    global x
    a={}
    a["CartBooks"] = str(x)
    return  jsonify(a)           


@app.route('/')
def HomePage():
    session['user'] = 'admin'
    return "<h1> admin:- Type /show_books to run bookscart</h1>"

@app.route('/show_books',methods=["GET","POST"])
def show_books():
    if request.method == 'POST':
        return redirect(url_for('checkOut'))
    return render_template('books.html')

@app.route('/request_info')
def showjson():
    return jsonify(data)

def getOrders():
    d1 = {}
    d1 = data["items"].copy()
    checkout = {}
    i=0
    for key in session:
        for i in range(len(d1)):
                d2 = {}
                d2 = d1[i]["volumeInfo"].copy()
                if d2["title"] == key:
                    d3 = {}
                    d3 = d1[i]["saleInfo"].copy()
                    d4={}
                    if d3["isEbook"] == True:
                        d4 = d3["listPrice"].copy()
                    if len(d4)>0 and session[key] != str(0) :
                        L =[]
                        L.append(d4["amount"])
                        L.append(session[key])
                        checkout[key]= L
    return checkout

def getOrderDetails():
    checkOut = {}
    checkOut = getOrders()
    TotalAmount = []
    sm=0
    for title in session :
        if session[title] != str(0):
            sm=(float(checkOut[title][0])*float(checkOut[title][1]))
            TotalAmount.append(round(sm,2))
    i=0
    for title in checkOut:
        L = []
        L = checkOut[title]
        if checkOut[title][1] >str(0):
            L.append(TotalAmount[i])
            checkOut[title] = L
            i+=1
        else:
            L.append(0)
            checkOut[title]=L
    sm = round(sum(TotalAmount),2)+(0.1)*round(sum(TotalAmount),2)
    d = []
    d.append(checkOut)
    d.append(sm)
    return d
    
   

@app.route('/checkOut',methods = ["GET","POST"])
def checkOut():
    error,here = None,None
    Details=[]
    Details = getOrderDetails()
    checkOut,s = {},0
    checkOut = dict(Details[0])
    s = int(Details[1])
    mobile = ""
    if request.method == "POST":        
        if not request.form['email'] or not request.form['mobile']:
            error = 'Fields are missing!!'
        else:
            #error = "In Else"
            #mobile = request.form['mobile']
            stmt = "SELECT mobile FROM Users where mobile ="+request.form['mobile']+""
            if db.engine.execute(stmt).fetchone() == None:
                error = "Success"
                User = Users(mobile=request.form['mobile'],email=request.form['email'])
                db.session.add(User)
                db.session.commit()
                #here = "Inside If block"
                for bookName in checkOut:
                    book = OrderDetails(bookName = str(bookName),price= float(checkOut[bookName][0]),Quantity=checkOut[bookName][1],Amount=float(checkOut[bookName][2]))
                    User.books.append(book)
                    #db.session.add(book)
                    db.session.commit()
            else:
                here = "have Skipped the If block"
                #print(here)
                #stmt = "SELECT * FROM Users where mobile =="+request.form['mobile']+""
                User = Users.query.filter_by(mobile = request.form['mobile']).first()
                #db.session.add(User)
                #print("Printing data ",user)

                for bookName in checkOut:
                	#print(bookName)
                	#print(checkOut[bookName][0])
                	#print(checkOut[bookName][1])
                	#print(checkOut[bookName][2])
                	book = OrderDetails(bookName = str(bookName),price= float(checkOut[bookName][0]),\
                                            Quantity=int(checkOut[bookName][1]),Amount= float(checkOut[bookName][2]))
                	User.books.append(book)
                	#db.session.add(book)
                	db.session.commit()
                	error = "Success"
    #print(checkOut)
    if error == "Success":
        #sessionClear()
        return redirect(url_for('showOrder'))
    return render_template("checkOut.html",result = checkOut,Total = s,error=error,here = here,User = mobile)
            


@app.route('/show_order',methods = ["GET","POST"])
def showOrder():
    error = None
    if request.method == "POST":
        if not request.form['email'] or not request.form['mobile']:
            error = 'Fields are missing!!'
        else:
            #mobile = request.form['mobile']
            stmt = "SELECT mobile FROM Users where mobile ="+request.form['mobile']+""
            if db.engine.execute(stmt).fetchone() == None:
                error = "Enter Your Details At the time of placing order"
            else:
                result = []
                i=1
                #stmt = "SELECT * FROM Users where mobile ="+request.form['mobile']+""
                User = Users.query.filter_by(mobile = request.form['mobile']).first()
                for order in User.books:
                        result.append([i,order.bookName,order.Quantity,order.Amount])
                        i+=1
                sessionClear()
                error == "Success"
                return render_template("orderDetails.html",result=result,email = request.form['email'],mobile = request.form['mobile'])

    return render_template("showOrder.html",error=error)
            
            
    

# if __name__ == "__main__":
    # app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
    # app.run(host="localhost",port=8082,debug=True)





