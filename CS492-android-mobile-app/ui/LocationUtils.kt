package com.example.cs492assignment5.ui

import kotlin.math.*

object LocationUtils {

    private const val EARTH_RADIUS_KM = 6371.0

    // Function to calculate the distance between two locations using the Haversine formula
    fun calculateDistance(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Double {
        val dLat = Math.toRadians(lat2 - lat1)
        val dLon = Math.toRadians(lon2 - lon1)

        val a = sin(dLat / 2).pow(2) +
                cos(Math.toRadians(lat1)) * cos(Math.toRadians(lat2)) *
                sin(dLon / 2).pow(2)

        val c = 2 * atan2(sqrt(a), sqrt(1 - a))

        // Return distance in kilometers
        return EARTH_RADIUS_KM * c
    }
}
