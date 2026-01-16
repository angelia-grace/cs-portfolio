package com.example.cs492assignment5.ui

/*

Assignment 5: Mobile Treasure Hunt App

Angelia-Grace (Cady) Martin / marticad@oregonstate.edu
CS 492 / Oregon State University

*/

import androidx.lifecycle.ViewModel
import com.example.cs492assignment5.data.Datasource
import com.example.cs492assignment5.model.Clue
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update

class TreasureViewModel : ViewModel() {

    private val _uiState = MutableStateFlow(CityUiState())
    val uiState: StateFlow<CityUiState> = _uiState
    val totalClueCount = 2

    init {
        initializeUIState()
    }

    private fun initializeUIState() {
        _uiState.value =
            CityUiState(
                isShowingHomepage = true,
                isShowingClue = false,
                thisClueSolved = false,
                isShowingPopup = false,
                huntCompleted = false,
                permsGranted = true,
                currentClue = Datasource.clues[0],
                cluesSolved = 0,
                clues = Datasource.clues,
                distanceFromCurrentClue = 1000.0,
                popup = false
            )
    }

    fun updateClueScreenStates(clue: Clue) {
        _uiState.update {
            it.copy(
                currentClue = clue,
                isShowingHomepage = false,
                isShowingClue = true,
                thisClueSolved = false
            )
        }
    }

    fun updateClueSolved() {
        _uiState.update {
            it.copy(
                thisClueSolved = true,
                cluesSolved = _uiState.value.cluesSolved + 1
            )
        }
        if (_uiState.value.cluesSolved == totalClueCount) {
            _uiState.update {
                it.copy(
                    huntCompleted = true
                )
            }
        }
    }

    fun updateClueFailed() {
        _uiState.update {
            it.copy(
                popup = true
            )
        }
    }

    fun nextClue() {
        _uiState.update {
            it.copy(
                currentClue = Datasource.clues[_uiState.value.cluesSolved],
                isShowingHomepage = false,
                isShowingClue = true,
                thisClueSolved = false
            )
        }
    }

    fun updateDistance(distance: Double) {
        _uiState.update {
            it.copy(
                distanceFromCurrentClue = distance
            )
        }
    }


    fun resetHomeScreenStates() {
        _uiState.update {
            it.copy(
                isShowingHomepage = true
            )
        }
    }

}