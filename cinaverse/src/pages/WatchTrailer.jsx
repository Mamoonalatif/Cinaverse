import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const WatchTrailer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    const {
        getMovieDetails,
        getMovieTrailer,
        getSimilarMovies,
        getReviewsByMovie,
        createReview,
        updateReview,
        deleteReview,
        addToWatchlist,
        getWatchlist,
        isAuthenticated
    } = useStore();

    const [movie, setMovie] = useState(null);
    const [trailerUrl, setTrailerUrl] = useState(null);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [addingToWatchlist, setAddingToWatchlist] = useState(false);

    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(5);
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        document.body.style.backgroundColor = '#000';
        setLoading(true);

        const fetchData = async () => {
            try {
                // LOAD MOVIE DATA FIRST (CRITICAL)
                const movieData = await getMovieDetails(id);
                setMovie(movieData);
                setLoading(false); // Show page immediately with movie info

                // LOAD EVERYTHING ELSE IN BACKGROUND (NON-BLOCKING)
                setTimeout(() => {
                    getMovieTrailer(id).then(data => setTrailerUrl(data?.trailerUrl || null)).catch(console.error);
                    getSimilarMovies(id).then(data => setSimilarMovies(Array.isArray(data) ? data : (data?.results || []))).catch(console.error);
                    getReviewsByMovie(id).then(data => setReviews(data || [])).catch(console.error);
                }, 50);

                if (isAuthenticated) {
                    getWatchlist().then(list => {
                        const inList = Array.isArray(list) && list.some(item => String(item.movieId) === String(id));
                        setIsInWatchlist(inList);
                    }).catch(console.error);
                }
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchData();
        return () => { document.body.style.backgroundColor = ''; };
    }, [id, isAuthenticated]);

    const handleAddToWatchlist = async () => {
        if (!isAuthenticated) return alert('Please login first');
        setAddingToWatchlist(true);
        try {
            const category = movie.genres?.[0]?.name || 'Action';
            await addToWatchlist(id, 'pending', category);
            setIsInWatchlist(true);
        } catch (error) {
            console.error(error);
        } finally {
            setAddingToWatchlist(false);
        }
    };

    const handleAddReview = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) return alert('Please login to review');
        if (!comment.trim()) return;
        setSubmittingReview(true);
        try {
            await createReview({ movieId: id, rating, comment });
            setComment('');
            const updatedReviews = await getReviewsByMovie(id);
            setReviews(updatedReviews);
        } catch (error) {
            alert(error.message);
        } finally {
            setSubmittingReview(false);
        }
    };

    const getYouTubeEmbedUrl = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0` : null;
    };

    if (loading) return <div className="bg-black min-vh-100"><Navbar /><div className="text-center mt-6 text-white text-[11px] uppercase fw-black tracking-widest pt-5">Targeting Movie...</div></div>;
    if (!movie) return <div className="bg-black min-vh-100"><Navbar /><div className="text-center mt-5 text-white">Target lost.</div></div>;

    const embedUrl = getYouTubeEmbedUrl(trailerUrl);

    return (
        <div className="bg-black min-vh-100 text-white" style={{ fontFamily: 'Nunito, Inter, Arial, sans-serif' }}>
            <Navbar />
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ff0000; }
                .movie-scroller { display: flex; overflow-x: auto; gap: 15px; padding-bottom: 15px; scroll-behavior: smooth; }
                .movie-card-mini { 
                    min-width: 200px; position: relative; border-radius: 12px; overflow: hidden; 
                    border: 1px solid #1a1a1a; transition: all 0.3s ease; cursor: pointer;
                }
                .movie-card-mini:hover { border-color: #ff0000; transform: translateY(-5px); }
                .movie-card-mini .play-overlay {
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(0,0,0,0.5); display: flex; align-items: center;
                    justify-content: center; opacity: 0; transition: opacity 0.3s;
                }
                .movie-card-mini:hover .play-overlay { opacity: 1; }
                .review-card { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 12px; padding: 15px; margin-bottom: 10px; }
            `}</style>

            <main className="container-fluid px-lg-5" style={{ paddingTop: '80px' }}>
                <div className="row g-4">
                    <div className="col-lg-9">
                        <div className="bg-black rounded-card overflow-hidden border border-dark mb-4 shadow-2xl">
                            {embedUrl ? (
                                <div className="ratio ratio-21x9 animate-in fade-in duration-700">
                                    <iframe src={embedUrl} title="Trailer" allowFullScreen />
                                </div>
                            ) : trailerUrl === null ? (
                                <div className="bg-dark d-flex flex-column align-items-center justify-content-center animate-in fade-in" style={{ height: '400px' }}>
                                    <div className="spinner-border text-danger mb-3" role="status"></div>
                                    <span className="text-secondary uppercase fs-6 fw-bold">Authenticating Stream...</span>
                                </div>
                            ) : (
                                <div className="bg-dark d-flex align-items-center justify-content-center" style={{ height: '400px' }}>
                                    <span className="text-secondary uppercase fs-6 fw-bold">Trailer Signal Lost</span>
                                </div>
                            )}
                        </div>

                        <div className="bg-dark/20 border border-dark rounded-card p-4 mb-5">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <h1 className="fw-black fs-3 uppercase mb-0 tracking-tighter">{movie.title}</h1>
                                <button
                                    className={`btn ${isInWatchlist ? 'btn-success' : 'custom-red-btn'} rounded-pill px-4 btn-sm fw-bold transition-all hover:scale-105`}
                                    onClick={handleAddToWatchlist}
                                    disabled={addingToWatchlist || isInWatchlist}
                                >
                                    <i className={`bi ${isInWatchlist ? 'bi-check-circle-fill' : 'bi-plus-circle'} me-2`}></i>
                                    {addingToWatchlist ? '...' : isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                                </button>
                            </div>
                            <p className="text-secondary fs-6 leading-relaxed mb-4 opacity-80">{movie.overview}</p>

                            <h4 className="text-danger fs-6 fw-bold uppercase tracking-widest border-bottom border-dark pb-2 mb-4">Similar Movies</h4>
                            <div className="custom-scrollbar movie-scroller">
                                {similarMovies.length > 0 ? similarMovies.map(m => (
                                    <div key={m.id} className="movie-card-mini" onClick={() => navigate(`/watch/${m.id}`)}>
                                        <img src={`https://image.tmdb.org/t/p/w400${m.backdrop_path || m.poster_path}`} className="w-100" style={{ height: '120px', objectFit: 'cover' }} alt="" />
                                        <div className="play-overlay">
                                            <div className="bg-danger rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                                <i className="bi bi-play-fill fs-4 text-white"></i>
                                            </div>
                                        </div>
                                        <div className="p-2 bg-black text-center">
                                            <div className="text-white text-[10px] fw-black text-truncate uppercase">{m.title}</div>
                                        </div>
                                    </div>
                                )) : <div className="text-secondary text-[10px] p-2">SCANNING FOR SIMILAR TARGETS...</div>}
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="mb-5">
                            <h4 className="text-danger fs-6 fw-bold uppercase tracking-widest border-bottom border-dark pb-2 mb-4">Reviews</h4>

                            {isAuthenticated && (
                                <form onSubmit={handleAddReview} className="mb-4 bg-dark/10 p-4 border border-dark rounded-card">
                                    <div className="mb-3">
                                        <label className="text-secondary text-[10px] uppercase fw-bold mb-2">Write review</label>
                                        <textarea
                                            className="form-control bg-black text-white border-dark text-[13px] focus:border-danger ring-0"
                                            rows="3"
                                            placeholder="Enter your field observation here..."
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="text-[10px] uppercase text-secondary fw-bold">Choose (Rating):</span>
                                            <select
                                                className="bg-black text-danger border-dark text-[12px] fw-bold rounded px-2 py-1 outline-none"
                                                value={rating}
                                                onChange={(e) => setRating(Number(e.target.value))}
                                            >
                                                {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                                            </select>
                                        </div>
                                        <button className="custom-red-btn btn-sm px-4 fw-black uppercase tracking-wider" disabled={submittingReview}>
                                            {submittingReview ? 'SENDING...' : 'Submit Review'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="reviews-list">
                                {reviews.length > 0 ? reviews.map(r => (
                                    <div key={r.id} className="review-card animate-in slide-in-from-bottom-2 duration-300">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-danger text-[11px] fw-black uppercase">{r.user?.firstName || 'FIELD AGENT'} {r.user?.lastName}</span>
                                            <span className="badge bg-danger/20 text-danger border border-danger/30 text-[9px] px-2">{r.rating} / 5</span>
                                        </div>
                                        <p className="text-secondary text-[12px] mb-0 opacity-90">{r.comment}</p>
                                    </div>
                                )) : (
                                    <div className="text-center py-5 border border-dashed border-dark rounded-card">
                                        <span className="text-secondary italic text-[11px] uppercase tracking-widest opacity-50">No review yet.</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-3">
                        <div className="bg-black border border-dark rounded-card p-4 sticky-top" style={{ top: '100px' }}>
                            <h5 className="text-white text-[10px] fw-black uppercase mb-3 tracking-widest border-bottom border-dark pb-2">Movie Details</h5>
                            <div className="d-flex flex-column gap-3">
                                <div>
                                    <div className="text-secondary text-[9px] uppercase fw-bold mb-1 opacity-60">Release Date</div>
                                    <div className="text-white text-xs fw-bold">{movie.release_date || 'CLASSIFIED'}</div>
                                </div>
                                <div>
                                    <div className="text-secondary text-[9px] uppercase fw-bold mb-1 opacity-60">Primary Language</div>
                                    <div className="text-white text-xs uppercase fw-bold">{movie.original_language || 'GLOBAL'}</div>
                                </div>
                                <div>
                                    <div className="text-secondary text-[9px] uppercase fw-bold mb-1 opacity-60">Overall ratings</div>
                                    <div className="text-danger fw-black fs-4 tracking-tighter">{movie.vote_average?.toFixed(1)}</div>
                                </div>
                                <div>
                                    <div className="text-secondary text-[9px] uppercase fw-bold mb-1 opacity-60">Status</div>
                                    <div className="text-white text-[11px] uppercase fw-bold">{movie.status || 'ACTIVE'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default WatchTrailer;
