// src/services/stravaService.js

const BASE_URL = 'https://www.strava.com/api/v3';

/**
 * Helper function to fetch data from Strava API.
 * @param {string} endpoint - The endpoint to fetch data from.
 * @param {string} accessToken - The access token for authorization.
 * @returns {Promise<object>} - The response data from Strava API.
 */
const getStravaData = async (endpoint, accessToken) => {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    if (!response.ok) {
      throw new Error(`Error fetching ${endpoint}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Fetch the clubs the authenticated athlete is a member of.
 * @param {string} accessToken - The access token for authorization.
 * @returns {Promise<object[]>} - The list of clubs.
 */
export const getClubs = (accessToken) => getStravaData('athlete/clubs', accessToken);

/**
 * Fetch the activities of a specific club.
 * @param {string} clubId - The ID of the club.
 * @param {string} accessToken - The access token for authorization.
 * @returns {Promise<object[]>} - The list of club activities.
 */
export const getClubActivities = (clubId, accessToken) => getStravaData(`clubs/${clubId}/activities`, accessToken);

/**
 * Fetch the members of a specific club.
 * @param {string} clubId - The ID of the club.
 * @param {string} accessToken - The access token for authorization.
 * @returns {Promise<object[]>} - The list of club members.
 */
export const getClubMembers = (clubId, accessToken) => getStravaData(`clubs/${clubId}/members`, accessToken);

// Add other Strava API methods as needed...

// Example: Fetch detailed information about a specific club
/**
 * Fetch detailed information about a specific club.
 * @param {string} clubId - The ID of the club.
 * @param {string} accessToken - The access token for authorization.
 * @returns {Promise<object>} - The detailed information of the club.
 */
export const getClubDetails = (clubId, accessToken) => getStravaData(`clubs/${clubId}`, accessToken);

// Example: Fetch athlete's activities
/**
 * Fetch the authenticated athlete's activities.
 * @param {string} accessToken - The access token for authorization.
 * @returns {Promise<object[]>} - The list of athlete's activities.
 */
export const getAthleteActivities = (accessToken) => getStravaData('athlete/activities', accessToken);

// Example: Fetch detailed information about the authenticated athlete  
/**
 * Fetch detailed information about the authenticated athlete.
 * @param {string} accessToken - The access token for authorization.
 * @returns {Promise<object>} - The detailed information of the athlete.
 */
export const getAthleteDetails = (accessToken) => getStravaData('athlete', accessToken);
