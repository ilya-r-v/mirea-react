import { useState } from 'react';
import { TextField, Box, Button, CircularProgress } from '@mui/material';
import useTechnologyApi from '../hooks/useTechnologyApi';

function TechnologySearch({ onSearchResults, onSearchStateChange }) {
    const [searchQuery, setSearchQuery] = useState('');
    const { searchTechnologies, loading, error } = useTechnologyApi();

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            onSearchResults(null);
            return;
        }

        onSearchStateChange({ loading: true, error: null });
        
        try {
            const results = await searchTechnologies(searchQuery);
            onSearchResults(results);
            onSearchStateChange({ loading: false, error: null });
        } catch (err) {
            onSearchStateChange({ loading: false, error: err.message });
        }
    };

    return (
        <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                    fullWidth
                    label="Поиск технологий в базе знаний"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    variant="outlined"
                    size="small"
                />
                <Button 
                    variant="contained" 
                    onClick={handleSearch}
                    disabled={loading || !searchQuery.trim()}
                >
                    {loading ? <CircularProgress size={24} /> : 'Найти'}
                </Button>
            </Box>
            
            {error && (
                <Box sx={{ color: 'error.main', fontSize: '0.875rem', mt: 1 }}>
                    Ошибка: {error}
                </Box>
            )}
        </Box>
    );
}

export default TechnologySearch;