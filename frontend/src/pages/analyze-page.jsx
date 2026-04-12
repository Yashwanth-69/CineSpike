import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, X } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/layout/page-header'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { analyzeTrailer, getAnalysisResults, getHealthStatus } from '../services/analysis-service'
import { useAnalysisStore } from '../store/analysis-store'

const genreOptions = [
  'action movie',
  'comedy film',
  'drama film',
  'horror movie',
  'science fiction film',
  'thriller movie',
  'romance movie',
  'fantasy movie',
  'crime movie',
  'animated film',
]

const emotionOptions = [
  'tense and suspenseful',
  'happy and uplifting',
  'mysterious and dark',
  'romantic and emotional',
  'scary and frightening',
  'exciting and adventurous',
  'sad and melancholic',
  'funny and comedic',
]

const statusSteps = [
  'Extracting genre and emotion signals',
  'Querying the vector store for comparable films',
  'Profiling audience communities and demographics',
  'Drafting the release strategy and saving the run',
]

export default function AnalyzePage() {
  const navigate = useNavigate()
  const { upsertAnalysis } = useAnalysisStore()
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedGenres, setSelectedGenres] = useState([])
  const [selectedEmotions, setSelectedEmotions] = useState([])
  const [manualMode, setManualMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [healthLabel, setHealthLabel] = useState('Checking backend health...')

  useEffect(() => {
    getHealthStatus()
      .then((data) => {
        setHealthLabel(data.db_movies > 0 ? `Vector DB ready with ${data.db_movies.toLocaleString()} indexed movies` : 'Vector DB is empty. Run ingest.py for full recommendations.')
      })
      .catch(() => {
        setHealthLabel('Unable to reach the Flask backend')
      })
  }, [])

  const dropzone = useDropzone({
    accept: {
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
      'video/x-msvideo': ['.avi'],
      'video/x-matroska': ['.mkv'],
    },
    maxFiles: 1,
    onDropAccepted(files) {
      setSelectedFile(files[0])
      setError('')
    },
    onDropRejected() {
      setError('Upload one valid trailer file: MP4, MOV, AVI, or MKV.')
    },
  })

  function toggleValue(value, collection, setter) {
    setter(collection.includes(value) ? collection.filter((item) => item !== value) : [...collection, value])
  }

  async function handleAnalyze() {
    if (!selectedFile) {
      setError('Select a trailer file before starting analysis.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const analyzed = await analyzeTrailer({
        file: selectedFile,
        genres: selectedGenres,
        emotions: selectedEmotions,
      })
      const fullAnalysis = await getAnalysisResults(analyzed.analysis_id)
      upsertAnalysis(fullAnalysis)
      navigate(`/insights/${analyzed.analysis_id}`)
    } catch (submitError) {
      setError(submitError.response?.data?.error || submitError.message || 'Analysis failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Analyze"
        title="Upload a trailer and generate a full marketing operating picture."
        description="Move from raw footage to genre signatures, comparable titles, Reddit audience fit, and release strategy in one guided flow."
        badge="Flask API"
      />

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Analyze Trailer</CardTitle>
            <CardDescription>Drag a trailer into the workspace, optionally override the tag model, and launch analysis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.div
              whileHover={{ y: -4 }}
              className={`rounded-[28px] border border-dashed p-8 text-center transition ${dropzone.isDragActive ? 'border-fuchsia-400/50 bg-fuchsia-500/10' : 'border-white/12 bg-white/[0.04]'}`}
              {...dropzone.getRootProps()}
            >
              <input {...dropzone.getInputProps()} />
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-br from-pink-500/20 via-fuchsia-500/20 to-blue-500/20 text-white">
                <Upload className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-white">Drag and drop your trailer here</h3>
              <p className="mt-2 text-sm text-zinc-400">MP4, MOV, AVI, or MKV up to 500MB. Click to browse if you prefer.</p>
            </motion.div>

            {selectedFile ? (
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <div>
                  <p className="text-sm text-zinc-400">Selected file</p>
                  <p className="text-white">{selectedFile.name}</p>
                </div>
                <Button variant="ghost" size="icon" type="button" onClick={() => setSelectedFile(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : null}

            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-4">
              <div>
                <p className="font-medium text-white">Manual tag override</p>
                <p className="text-sm text-zinc-400">Use this when you want controlled genres or emotional tone instead of automatic detection.</p>
              </div>
              <button
                type="button"
                onClick={() => setManualMode((current) => !current)}
                className={`relative h-7 w-14 rounded-full transition ${manualMode ? 'bg-linear-to-r from-pink-500 to-blue-500' : 'bg-zinc-700'}`}
              >
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${manualMode ? 'left-8' : 'left-1'}`} />
              </button>
            </div>

            {manualMode ? (
              <div className="grid gap-6 lg:grid-cols-2">
                <SelectionPanel
                  title="Genres"
                  items={genreOptions}
                  selected={selectedGenres}
                  onToggle={(value) => toggleValue(value, selectedGenres, setSelectedGenres)}
                />
                <SelectionPanel
                  title="Emotional Tone"
                  items={emotionOptions}
                  selected={selectedEmotions}
                  onToggle={(value) => toggleValue(value, selectedEmotions, setSelectedEmotions)}
                />
              </div>
            ) : null}

            {error ? <p className="text-sm text-red-300">{error}</p> : null}

            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" className="min-w-44" onClick={handleAnalyze} disabled={isSubmitting}>
                {isSubmitting ? 'Analyzing Trailer...' : 'Analyze Trailer'}
              </Button>
              <p className="text-sm text-zinc-400">{healthLabel}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What the backend produces</CardTitle>
            <CardDescription>Your existing Flask endpoints remain untouched. React only changes the presentation layer.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {statusSteps.map((step, index) => (
              <div key={step} className="flex items-start gap-4 rounded-2xl border border-white/8 bg-black/20 p-4">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-white">{step}</p>
                  <p className="mt-1 text-sm text-zinc-400">Same backend logic, now surfaced inside a modular React workflow.</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  )
}

function SelectionPanel({ title, items, selected, onToggle }) {
  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-sm font-medium text-white">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const active = selected.includes(item)
          return (
            <button
              key={item}
              type="button"
              onClick={() => onToggle(item)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${active ? 'border-fuchsia-400/40 bg-fuchsia-500/12 text-fuchsia-100' : 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10'}`}
            >
              {item}
            </button>
          )
        })}
      </div>
      {selected.length ? (
        <div className="flex flex-wrap gap-2">
          {selected.map((item) => (
            <Badge key={item} variant="default">
              {item}
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  )
}
