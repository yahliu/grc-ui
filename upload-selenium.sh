# Licensed Materials - Property of IBM 
# (c) Copyright IBM Corporation 2018. All Rights Reserved.
# Note to U.S. Government Users Restricted Rights: 
# Use, duplication or disclosure restricted by GSA ADP Schedule 
# Contract with IBM Corp. 

spawn scp -r selenium-test root@9.37.247.85:/root

expect "Please type 'yes' or 'no':"

send yes\n;

expect "password:"

send AHippopotamusPlaysHopscotchWithAnElephant2\n;

interact