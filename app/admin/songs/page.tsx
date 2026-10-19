"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Loader2, Plus, Trash2, Music2, Search, Play, Pause } from "lucide-react"

interface Song {
  id: string
  title: string
  artist: string | null
  url: string
  createdAt: string
}

export default function AdminSongsPage() {
  const [songs, setSongs] = React.useState<Song[]>([])
  const [loading, setLoading] = React.useState(true)
  const [uploading, setUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState("")
  const [playingId, setPlayingId] = React.useState<string | null>(null)

  // Form state
  const [title, setTitle] = React.useState("")
  const [artist, setArtist] = React.useState("")
  const [file, setFile] = React.useState<File | null>(null)
  const [fileName, setFileName] = React.useState("")

  // Search state
  const [search, setSearch] = React.useState("")

  const audioRefs = React.useRef<Record<string, HTMLAudioElement>>({})

  const fetchSongs = async () => {
    try {
      const res = await fetch("/api/admin/songs")
      const data = await res.json()
      if (data.songs) setSongs(data.songs)
    } catch (error) {
      console.error("Failed to fetch songs", error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchSongs()
  }, [])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !file) return alert("Title and File are required")

    setUploadError("")
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
      const uploadData = await uploadRes.json()

      if (!uploadData.url) throw new Error(uploadData.error || "Upload failed")

      const saveRes = await fetch("/api/admin/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, artist, url: uploadData.url }),
      })
      const saveData = await saveRes.json()
      if (saveData.song) {
        setSongs([saveData.song, ...songs])
        setTitle("")
        setArtist("")
        setFile(null)
        setFileName("")
        const fileInput = document.getElementById("song-file") as HTMLInputElement
        if (fileInput) fileInput.value = ""
      }
    } catch (err: any) {
      setUploadError(err.message || "Something went wrong")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this song?")) return
    // Stop if playing
    if (playingId === id) {
      audioRefs.current[id]?.pause()
      setPlayingId(null)
    }
    try {
      await fetch(`/api/admin/songs/${id}`, { method: "DELETE" })
      setSongs(songs.filter(s => s.id !== id))
    } catch {
      alert("Failed to delete song")
    }
  }

  const togglePlay = (song: Song) => {
    const audio = audioRefs.current[song.id]
    if (!audio) return

    if (playingId === song.id) {
      audio.pause()
      setPlayingId(null)
    } else {
      // Pause currently playing
      if (playingId && audioRefs.current[playingId]) {
        audioRefs.current[playingId].pause()
      }
      audio.play()
      setPlayingId(song.id)
    }
  }

  const filteredSongs = songs.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.artist?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="py-8">
      <div className="container px-6 md:px-10 mx-auto max-w-6xl space-y-8">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" as const }}>
          <h1 className="text-3xl font-bold">Song Library</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage background music available for users in their event templates.{" "}
            <span className="font-medium text-foreground">{songs.length} songs</span> in library.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-[340px_1fr] gap-8 items-start">
          {/* Upload Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" as const }}
            className="bg-card border rounded-2xl p-6 shadow-sm sticky top-20"
          >
            <h2 className="text-lg font-semibold mb-1">Add New Song</h2>
            <p className="text-xs text-muted-foreground mb-5">
              Upload a real <strong>MP3, WAV, AAC, or FLAC</strong> audio file.<br />
              <span className="text-destructive">⚠ YouTube links or videos cannot be uploaded.</span>
            </p>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Song Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  placeholder="e.g. Perfect"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Artist</label>
                <input
                  type="text"
                  value={artist}
                  onChange={e => setArtist(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  placeholder="e.g. Ed Sheeran"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Audio File * (MP3, MP4)</label>
                <label
                  htmlFor="song-file"
                  className="flex flex-col items-center justify-center gap-2 w-full h-24 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer text-center px-3"
                >
                  <Music2 className="w-6 h-6 text-primary/60" />
                  <span className="text-xs text-muted-foreground">
                    {fileName ? fileName : "Click to choose audio file"}
                  </span>
                </label>
                <input
                  id="song-file"
                  type="file"
                  required
                  accept="audio/*,video/mp4"
                  className="hidden"
                  onChange={e => {
                    const f = e.target.files?.[0] || null
                    setFile(f)
                    setFileName(f?.name ?? "")
                  }}
                />
              </div>
              {uploadError && (
                <div className="px-3 py-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                  {uploadError}
                </div>
              )}
              <button
                type="submit"
                disabled={uploading}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {uploading ? "Uploading..." : "Upload Song"}
              </button>
            </form>
          </motion.div>

          {/* Song List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" as const }}
            className="space-y-4"
          >
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search songs by title or artist..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
              />
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredSongs.length === 0 ? (
              <div className="text-center py-20 border rounded-2xl bg-muted/20">
                <Music2 className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-20" />
                <p className="text-muted-foreground font-medium">No songs found</p>
                <p className="text-xs text-muted-foreground mt-1">Upload a song using the form on the left.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredSongs.map((song, i) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`p-4 bg-card border rounded-2xl transition-all ${
                      playingId === song.id ? "border-primary/50 shadow-sm shadow-primary/10" : "hover:border-primary/30"
                    }`}
                  >
                    {/* Hidden audio element */}
                    <audio
                      ref={el => { if (el) audioRefs.current[song.id] = el }}
                      src={song.url}
                      onEnded={() => setPlayingId(null)}
                    />

                    <div className="flex items-center gap-4">
                      {/* Play/Pause button */}
                      <button
                        onClick={() => togglePlay(song)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          playingId === song.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/10 text-primary hover:bg-primary/20"
                        }`}
                        title={playingId === song.id ? "Pause" : "Play"}
                      >
                        {playingId === song.id
                          ? <Pause className="w-4 h-4" />
                          : <Play className="w-4 h-4 translate-x-0.5" />
                        }
                      </button>

                      {/* Song info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{song.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{song.artist || "Unknown Artist"}</p>

                        {/* Audio progress bar (browser native) */}
                        <audio
                          src={song.url}
                          controls
                          className="w-full h-8 mt-2"
                          style={{ accentColor: "var(--primary)" }}
                        />
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(song.id)}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors shrink-0"
                        title="Delete Song"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
