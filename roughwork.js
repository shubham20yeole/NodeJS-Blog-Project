var express = require('express');
var SparkPost = require('sparkpost');
var sp = new SparkPost('***********');
var port = process.env.PORT || 3000
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs')
var mongodb = require('mongodb')
var collections = ["users", "blog", "comments"]
var db = mongojs('mongodb://***********:***********@***********.mlab.com:***********/***********', collections);
var collections2 = ["users", "blog", "comments", "property", "images", "notification", "bookmark", "messages","timetable", "timetablecategory", "timetablequestion", "locations"]
var db2 = mongojs('mongodb://***********:***********@***********.mlab.com:***********/***********', collections2)
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport")
var smtpTransport = nodemailer.createTransport(smtpTransport({
    host : "smtp.sendgrid.net.",
    secureConnection : false,
    port: 587,
    auth : {
        user : "shubham20.yeole@gmail.com",
        pass : "***********"
    }
}));