package com.example.cs492assignment5.ui

/*

Assignment 5: Mobile Treasure Hunt App

Angelia-Grace (Cady) Martin / marticad@oregonstate.edu
CS 492 / Oregon State University

*/

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.graphics.Color
import androidx.compose.material3.Icon
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Call
import androidx.compose.material.icons.rounded.Email
import androidx.compose.material.icons.rounded.Share
import androidx.compose.material3.Button
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import com.example.cs492assignment5.data.Datasource
import com.example.cs492assignment5.model.Clue
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices

@Composable
fun ClueScreen(
    clue: Clue,
    cityUiState: CityUiState,
    onClueFound: () -> Unit,
    onClueFailed: () -> Unit,
    onQuit: () -> Unit
) {
    Surface(
        modifier = Modifier.fillMaxSize(),
        //color = MaterialTheme.colorScheme.background
        color = Color(0x6699CCFF)
    ) {
        Column() {
            ClueDetails(clue = clue, cityUiState = cityUiState)
            HintButton(clue = clue, cityUiState = cityUiState)
            FoundItButton(
                clue = clue,
                cityUiState = cityUiState,
                onClueFound = onClueFound,
                onClueFailed = onClueFailed
            )
            QuitButton(cityUiState = cityUiState, onQuit = onQuit)
        }
    }
}

@Composable
fun ClueDetails (
    clue: Clue,
    cityUiState: CityUiState,
) {
    Column(
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.padding(20.dp, 40.dp)
    ) {
        Spacer(modifier = Modifier.height(20.dp))
        Text(
            text = clue.cluetext,
            fontSize = 20.sp
        )
        Spacer(modifier = Modifier.height(10.dp))
    }
}

@Composable
fun HintButton (
    clue: Clue,
    cityUiState: CityUiState
) {
    Button(
        onClick = {}
    ) {
        Row(modifier = Modifier.padding(8.dp)) {
            Text(
                text = "HINT",
                fontWeight = FontWeight.Bold
            )
        }
    }
}

@Composable
fun FoundItButton(
    clue: Clue,
    cityUiState: CityUiState,
    onClueFound: () -> Unit,
    onClueFailed: () -> Unit
) {
    Button(
        onClick = onClueFound
    ) {
        Row(modifier = Modifier.padding(8.dp)) {
            Text(
                text = "FOUND IT!",
                fontWeight = FontWeight.Bold
            )
        }
    }
}

@Composable
fun QuitButton(
    cityUiState: CityUiState,
    onQuit: () -> Unit
) {
    Button(
        onClick = onQuit
    ) {
        Row(modifier = Modifier.padding(8.dp)) {
            Text(
                text = "QUIT",
                fontWeight = FontWeight.Bold
            )
        }
    }
}

