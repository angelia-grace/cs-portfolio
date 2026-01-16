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

@Composable
fun ClueSolvedScreen(
    clue: Clue,
    cityUiState: CityUiState,
    onContinue: () -> Unit
) {
    Surface(
        modifier = Modifier.fillMaxSize(),
        //color = MaterialTheme.colorScheme.background
        color = Color(0x6699CCFF)
    ) {
        Column() {
            ClueSolvedDetails(clue = clue, cityUiState = cityUiState)
            ContinueButton(cityUiState = cityUiState, onContinue = onContinue)
        }
    }
}

@Composable
fun ClueSolvedDetails (
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
            text = clue.address,
            fontSize = 20.sp
        )
        Spacer(modifier = Modifier.height(10.dp))
        Text(
            text = clue.info
        )
        Spacer(modifier = Modifier.height(20.dp))
    }
}

@Composable
fun ContinueButton(
    cityUiState: CityUiState,
    onContinue: () -> Unit
) {
    Button(
        onClick = onContinue
    ) {
        Row(modifier = Modifier.padding(8.dp)) {
            Text(
                text = "CONTINUE",
                fontWeight = FontWeight.Bold
            )
        }
    }
}
