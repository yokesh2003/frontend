import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { audiobookService } from '../../services/audiobookService';
import { libraryService } from '../../services/libraryService';
import { Audiobook } from '../../types/Audiobook';
import AudiobookCard from './AudiobookCard';

const Home: React.FC = () => {
  const [audiobooks, setAudiobooks] = useState<Audiobook[]>([]);
  const [filteredAudiobooks, setFilteredAudiobooks] = useState<Audiobook[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('title_asc');
  const [loading, setLoading] = useState(true);
  const [libraryAudioIds, setLibraryAudioIds] = useState<number[]>([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    loadAudiobooks();
  }, []);

  useEffect(() => {
    const loadLibrary = async () => {
      if (!user || !isAuthenticated) {
        setLibraryAudioIds([]);
        return;
      }
      try {
        const library = await libraryService.viewLibrary(user.customerId);
        // Get audioId from either item.audioId or item.audiobook.audioId
        const ids = library.map((item) => item.audioId || item.audiobook?.audioId).filter((id): id is number => id !== undefined);
        setLibraryAudioIds(ids);
      } catch (error) {
        console.error('Error loading library for home:', error);
        setLibraryAudioIds([]);
      }
    };

    loadLibrary();
  }, [user, isAuthenticated]);

  useEffect(() => {
    filterAndSortAudiobooks();
  }, [searchTerm, sortBy, audiobooks]);

  const loadAudiobooks = async () => {
    try {
      const data = await audiobookService.getAllAudiobooks();
      setAudiobooks(data);
      setFilteredAudiobooks(data);
    } catch (error) {
      console.error('Error loading audiobooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortAudiobooks = () => {
    let filtered = [...audiobooks];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (book.authorName && book.authorName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const [field, direction] = sortBy.split('_');
      let comparison = 0;

      if (field === 'price') {
        comparison = a.price - b.price;
      } else if (field === 'rating') {
        comparison = (a.totalStar || 0) - (b.totalStar || 0);
      } else {
        comparison = a.title.localeCompare(b.title);
      }

      return direction === 'desc' ? -comparison : comparison;
    });

    setFilteredAudiobooks(filtered);
  };

  if (loading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row mb-4 align-items-center">
        <div className="col-md-6 mb-2 mb-md-0">
          <div className="input-group">
            <input
              className="form-control"
              type="text"
              placeholder="Search audiobooks by title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={filterAndSortAudiobooks}
            >
              Search
            </button>
          </div>
        </div>
        <div className="col-md-6 d-flex justify-content-md-end">
          <div className="d-flex align-items-center" style={{ gap: '8px' }}>
            <span className="text-muted small" style={{ whiteSpace: 'nowrap' }}>
              Sort by
            </span>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ maxWidth: '220px' }}
            >
              <option value="title_asc">Title</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Rating: High to Low</option>
              <option value="rating_asc">Rating: Low to High</option>
            </select>
          </div>
        </div>
      </div>
      <div className="row">
        {filteredAudiobooks.length === 0 ? (
          <div className="col">
            <p className="text-center">No audiobooks found.</p>
          </div>
        ) : (
          filteredAudiobooks.map((audiobook) => (
            <div key={audiobook.audioId} className="col-12 mb-3">
              <AudiobookCard
                audiobook={audiobook}
                isInLibrary={libraryAudioIds.includes(audiobook.audioId)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;

