package com.example.cs492assignment5.ui

/*

Assignment 5: Mobile Treasure Hunt App

Angelia-Grace (Cady) Martin / marticad@oregonstate.edu
CS 492 / Oregon State University

*/

import android.content.Context
import android.location.Location
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.ui.Modifier
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.core.content.ContextCompat
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.cs492assignment5.data.Datasource
import com.example.cs492assignment5.model.Clue
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.Priority
import com.google.android.gms.location.LocationServices

import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import android.Manifest
import android.content.pm.PackageManager
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.TextButton
import androidx.compose.ui.graphics.vector.ImageVector


@Composable
fun TreasureApp(
    modifier: Modifier = Modifier,
    context: Context
) {

    val location = remember { mutableStateOf<Location?>(null) }
    val distance = remember { mutableStateOf<Double?>(null) }
    val permissionGranted = remember { mutableStateOf(false) }
    val openAlertDialog = remember { mutableStateOf(false) }
    val fusedLocationClient: FusedLocationProviderClient =
        LocationServices.getFusedLocationProviderClient(context)

    val locationPermissionRequest = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { isGranted: Boolean ->
        permissionGranted.value = isGranted
    }

    LaunchedEffect(Unit) {
        when {
            ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED -> {
                permissionGranted.value = true
            }
            else -> {
                locationPermissionRequest.launch(Manifest.permission.ACCESS_FINE_LOCATION)
            }
        }
    }

    //val navigationType: ReplyNavigationType
    //val viewModel: ReplyViewModel = viewModel()
    val viewModel: TreasureViewModel = viewModel()
    val cityUiState = viewModel.uiState.collectAsState().value

    if (cityUiState.isShowingHomepage) {
        TreasureHomeScreen(cityUiState = cityUiState,
            onStartButtonPressed = {
                viewModel.updateClueScreenStates(
                    clue = Datasource.clues[0]
                )
            }
        )
    } else if (cityUiState.permsGranted == false) {
        // pass for now
        //PermsScreen(cityUiState = cityUiState)
    } else if (cityUiState.huntCompleted) {
        TreasureFoundScreen(
            cityUiState = cityUiState,
            onQuit = {viewModel.resetHomeScreenStates()}
        )
    } else if (cityUiState.thisClueSolved) {
        ClueSolvedScreen(cityUiState = cityUiState,
            clue = cityUiState.currentClue,
            onContinue = { viewModel.nextClue() }
        )
    } else if (cityUiState.isShowingClue) {
        ClueScreen(cityUiState = cityUiState,
            clue = cityUiState.currentClue,
            onClueFound = {
                if (permissionGranted.value) {
                    fusedLocationClient.getCurrentLocation(
                        Priority.PRIORITY_HIGH_ACCURACY,
                        null
                    ).addOnSuccessListener { loc: Location? ->
                        // Home of the Beavs! Yah Pac2!
                        val clueTargetLat = cityUiState.currentClue.lat
                        val clueTargetLon = cityUiState.currentClue.lon
                        if (loc != null) {
                            // Safely calculate the distance to the target location (In Kilometers)
                            val calculatedDistance = LocationUtils.calculateDistance(
                                clueTargetLat,
                                clueTargetLon,
                                loc.latitude,
                                loc.longitude
                            )
                            viewModel.updateDistance(calculatedDistance)
                        }
                        // Update location
                        location.value = loc
                    }
                }
                if (cityUiState.distanceFromCurrentClue < 0.01) {
                    viewModel.updateClueSolved()
                } else {
                    openAlertDialog.value = true
                }
            },
            onClueFailed = {},
            onQuit = {viewModel.resetHomeScreenStates()}
        )
    }

    @OptIn(ExperimentalMaterial3Api::class)
    @Composable
    fun AlertDialogExample(
        onDismissRequest: () -> Unit,
        onConfirmation: () -> Unit,
        dialogTitle: String,
        dialogText: String,
        icon: ImageVector,
    ) {
        AlertDialog(
            icon = {
                Icon(icon, contentDescription = "Example Icon")
            },
            title = {
                Text(text = dialogTitle)
            },
            text = {
                Text(text = dialogText)
            },
            onDismissRequest = {
                onDismissRequest()
            },
            confirmButton = {
                TextButton(
                    onClick = {
                        onConfirmation()
                    }
                ) {
                    Text("Confirm")
                }
            },
            dismissButton = {
                TextButton(
                    onClick = {
                        onDismissRequest()
                    }
                ) {
                    Text("Dismiss")
                }
            }
        )
    }

    @Composable
    fun FailureDialog() {
        // ...

        // ...
        when {
            // ...
            openAlertDialog.value -> {
                AlertDialogExample(
                    onDismissRequest = { openAlertDialog.value = false },
                    onConfirmation = {
                        openAlertDialog.value = false
                    },
                    dialogTitle = "Try again!",
                    dialogText = "Incorrect location.",
                    icon = Icons.Default.Info
                )
            }
        }
    }


}
