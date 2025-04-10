import rmp from 'ratemyprofessor-api';

/**
 * Search for a professor's ratings at a specific school
 * @param {string} schoolName - Full name of the school (e.g., "University of Florida")
 * @param {string} professorName - Full name of the professor (e.g., "John Smith")
 * @returns {Promise<Object|null>} Professor ratings data or null if not found
 */
async function getProfessorRatings(schoolName, professorName) {
    try {
        if (!schoolName || !professorName) {
            throw new Error("School name and professor name are required");
        }

        // Search for the school
        const schools = await rmp.searchSchool(schoolName);
        if (!schools || schools.length === 0) {
            return null;
        }

        // Find exact school name match
        const school = schools.find(s => s.node.name.toLowerCase() === schoolName.toLowerCase());
        if (!school) {
            return null;
        }

        // Search for professor at the school
        const professors = await rmp.searchProfessorsAtSchoolId(professorName, school.node.id);
        if (!professors || professors.length === 0) {
            return null;
        }

        // Get detailed ratings
        const ratings = await rmp.getProfessorRatingAtSchoolId(professorName, school.node.id);
        if (!ratings) {
            return null;
        }
        console.log(`${ratings.formattedName} ${ratings.avgRating}`);

        // Format the response
        return {
            school: {
                name: school.node.name,
                id: school.node.id
            },
            professor: {
                name:ratings.formattedName,
                link:ratings.link,
                department: ratings.department,
                ratings: {
                    overall: ratings.avgRating,
                    difficulty: ratings.avgDifficulty,
                    wouldTakeAgain: ratings.wouldTakeAgainPercent,
                    totalRatings: ratings.numRatings
                },
                recentReviews: (ratings.ratings || [])
                    .slice(0, 3)
                    .map(rating => ({
                        quality: rating.quality,
                        difficulty: rating.difficulty,
                        course: rating.class,
                        comment: rating.comment
                    }))
            }
        };
    } catch (error) {
        throw new Error(`Failed to fetch professor ratings: ${error.message}`);
    }
}

// Export the API function
export default getProfessorRatings;