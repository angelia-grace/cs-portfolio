package com.example.cs492assignment5.ui

/*

Assignment 5: Mobile Treasure Hunt App

Angelia-Grace (Cady) Martin / marticad@oregonstate.edu
CS 492 / Oregon State University

*/

import android.service.autofill.OnClickAction
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.Card
//import androidx.compose.material.icons.filled.Drafts
//import androidx.compose.material.icons.filled.Inbox
//import androidx.compose.material.icons.filled.Report
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.ui.res.stringResource

@Composable
fun TreasureHomeScreen(
    cityUiState: CityUiState,
    onStartButtonPressed: () -> Unit
) {
    Column() {
        Text(
            text = "Mobile Treasure Hunt App",
            fontWeight = FontWeight.Bold
        )
        Text(
            text = "This game is played by following clues to locations near you. As long as location services are enabled, follow the clues and use the 'FOUND IT' button to check if you've reached the next location in the treasure hunt, until it is completed!"
        )
        StartButton(
            modifier = Modifier, onStartButtonPressed = onStartButtonPressed
        )
    }
}

@Composable
fun StartButton(modifier: Modifier = Modifier, onStartButtonPressed: () -> Unit) {
    Button(
        onClick = onStartButtonPressed
    ) {
        Row(modifier = Modifier.padding(8.dp)) {
            //Icon()
            Text(
                text = "START",
                fontWeight = FontWeight.Bold
            )
        }
    }
}