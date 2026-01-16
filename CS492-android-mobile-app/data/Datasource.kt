package com.example.cs492assignment5.data

import com.example.cs492assignment5.model.Clue

/*

Assignment 5: Mobile Treasure Hunt App

Angelia-Grace (Cady) Martin / marticad@oregonstate.edu
CS 492 / Oregon State University

*/

object Datasource {
    val clues = listOf(
        Clue(address = "1234 Example Street", cluetext = "Clever clue 1 text here", info = "Interesting info about Clue 1", hint = "Hint for Clue 1", lat = 37.3965, lon = -122.0928),
        Clue(address = "5678 Example Street", cluetext = "Clever clue 2 text here", info = "Interesting info about Clue 2", hint = "Hint for Clue 2", lat = 37.4445, lon = -122.1972)
    )
}