# Spotify Playlist Maker

This project is a web application built with React that allows users to create and manage Spotify playlists. It leverages the Spotify API to provide a seamless experience for curating music.

## Features

*   **User Authentication**: Securely log in with your Spotify account.
*   **Browse/Search Music**: Discover new tracks, albums, and artists from the Spotify catalog.
*   **Create Custom Playlists**: Easily create new playlists.
*   **Drag-and-Drop Interface**: Organize tracks within your playlists with intuitive drag-and-drop functionality.
*   **Playback Functionality**: Play track previews directly within the application.
*   **Dynamic UI**: Responsive and interactive user interface.
*   **State Management**: Efficient state management using Redux.

## Technologies Used

*   **React**: A JavaScript library for building user interfaces.
*   **Redux**: For predictable state management.
*   **React Router**: For declarative routing.
*   **Axios**: For making HTTP requests to the Spotify API.
*   **React Beautiful DnD**: For drag and drop interfaces.
*   **TypeScript**: For type-safe JavaScript.
*   **Sass**: CSS preprocessor for styling.

## Installation and Setup

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/spotify-playlist-maker.git
    cd spotify-playlist-maker
    ```
2.  **Install dependencies:**
    ```bash
    yarn install
    # or npm install
    ```
3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add your Spotify API credentials. You will need to register your application on the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).

    ```
    REACT_APP_SPOTIFY_CLIENT_ID=YOUR_SPOTIFY_CLIENT_ID
    REACT_APP_SPOTIFY_REDIRECT_URI=http://localhost:3000
    ```
4.  **Run the application:**
    ```bash
    yarn start
    # or npm start
    ```
    The application will open in your browser at `http://localhost:3000`.

## Usage

1.  **Log in**: Click the "Login with Spotify" button to authenticate your account.
2.  **Search for music**: Use the search bar to find songs, artists, or albums.
3.  **Create a playlist**: Click on the "Create Playlist" button and give your playlist a name and description.
4.  **Add songs**: Drag and drop songs from the search results into your new playlist.
5.  **Reorder songs**: Reorder songs within your playlist using the drag-and-drop feature.
6.  **Play previews**: Click on a song to listen to a 30-second preview.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
