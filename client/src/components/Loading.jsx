const Loading = ({ message = "Loading..." }) => {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center py-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            {message && <p className="text-muted mt-2 small">{message}</p>}
        </div>
    );
};

export default Loading;
