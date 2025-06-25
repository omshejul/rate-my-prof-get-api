import express from 'express';
import cors from 'cors';
import getProfessorRatings from './index.js';

const app = express();
const PORT = process.env.PORT || 4002;

// Middleware
app.use(cors());
app.use(express.json());


// API Routes
app.get('/api/professor', async (req, res) => {
    try {
        const { school, professor } = req.query;

        if (!school || !professor) {
            return res.status(400).json({
                error: 'Both school and professor parameters are required'
            });
        }

        const ratings = await getProfessorRatings(school, professor);
        
        if (!ratings) {
            return res.status(404).json({
                error: 'No matching professor found at the specified school'
            });
        }

        res.json(ratings);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ status: 'ok' });
});
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    // console.log('Available endpoints:');
    // console.log(`  GET /api/professor?school=School%20Name&professor=Professor%20Name`);
    // console.log(`  GET /health`);
}); 