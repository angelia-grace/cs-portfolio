package com.example.cs492assignment5.ui

/*

Assignment 5: Mobile Treasure Hunt App

Angelia-Grace (Cady) Martin / marticad@oregonstate.edu
CS 492 / Oregon State University

*/

import com.example.cs492assignment5.data.Datasource
import com.example.cs492assignment5.model.Clue

data class CityUiState(
    val isShowingHomepage: Boolean = true,
    val isShowingClue: Boolean = false,
    val thisClueSolved: Boolean = false,
    val isShowingPopup: Boolean = false,
    val huntCompleted: Boolean = false,
    val permsGranted: Boolean = true,
    val currentClue: Clue = Datasource.clues[0],
    val cluesSolved: Int = 0,
    val clues: List<Clue> = Datasource.clues,
    val distanceFromCurrentClue: Double = 1000.0,
    val popup: Boolean = false
) {

}