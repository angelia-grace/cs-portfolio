package com.example.cs492assignment5.model

/*

Assignment 5: Mobile Treasure Hunt App

Angelia-Grace (Cady) Martin / marticad@oregonstate.edu
CS 492 / Oregon State University

*/

data class Clue (
    val address:    String,
    val cluetext:   String,
    val info:       String,
    val hint:       String,
    val lat:        Double,
    val lon:        Double
)
