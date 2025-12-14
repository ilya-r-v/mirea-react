import { useState } from 'react';
import { TextField, Box, Button, CircularProgress } from '@mui/material';
import useTechnologyApi from '../hooks/useTechnologyApi';

function TechnologySearch({ onSearchResults, onSearchStateChange, userTechnologies = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const { searchTechnologies, loading, error } = useTechnologyApi();

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            onSearchResults(null);
            return;
        }

        onSearchStateChange({ loading: true, error: null });
        
        try {
            // Поиск в статической базе знаний
            const staticResults = await searchTechnologies(searchQuery);
            
            // Поиск в пользовательских технологиях
            const userResults = userTechnologies.filter(tech => {
                const query = searchQuery.toLowerCase();
                return (
                    tech.title.toLowerCase().includes(query) ||
                    tech.description?.toLowerCase().includes(query) ||
                    tech.category?.toLowerCase().includes(query) ||
                    tech.difficulty?.toLowerCase().includes(query)
                );
            });

            // Объединяем результаты, убираем дубликаты по ID
            const allResults = [...userResults, ...staticResults];
            const uniqueResults = allResults.filter((tech, index, self) =>
                index === self.findIndex(t => t.id === tech.id)
            );

            onSearchResults(uniqueResults);
            onSearchStateChange({ loading: false, error: null });
        } catch (err) {
            onSearchStateChange({ loading: false, error: err.message });
        }
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        onSearchResults(null);
        onSearchStateChange({ loading: false, error: null });
    };

    return (
        <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                <TextField
                    fullWidth
                    label="Поиск технологий"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    variant="outlined"
                    size="small"
                    placeholder="Введите название"
                    helperText="Ищет в базе знаний и ваших технологиях"
                />
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Button 
                        variant="contained" 
                        onClick={handleSearch}
                        disabled={loading || !searchQuery.trim()}
                        sx={{ minWidth: '100px' }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Найти'}
                    </Button>
                    {searchQuery && (
                        <Button 
                            variant="outlined" 
                            onClick={handleClearSearch}
                            disabled={loading}
                        >
                            Очистить
                        </Button>
                    )}
                </Box>
            </Box>
            
            {error && (
                <Box sx={{ 
                    color: 'error.main', 
                    fontSize: '0.875rem', 
                    mt: 1,
                    p: 1,
                    bgcolor: 'error.light',
                    borderRadius: 1
                }}>
                    Ошибка: {error}
                </Box>
            )}

            {searchQuery && userTechnologies.length > 0 && (
                <Box sx={{ 
                    fontSize: '0.875rem', 
                    color: 'text.secondary',
                    mt: 1
                }}>
                    Поиск в {userTechnologies.length} ваших технологиях
                </Box>
            )}
        </Box>
    );
}

export default TechnologySearch;