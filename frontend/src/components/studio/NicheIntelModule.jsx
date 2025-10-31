import { useState } from 'react'
import { Brain, TrendingUp, Hash, Users, Clock, Target, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import studioAPI from '@/services/studioAPI'
import { useStudioContext } from '@/contexts/StudioContext'

const NICHE_OPTIONS = [
  'Lifestyle',
  'Fitness',
  'Business',
  'Fashion',
  'Food',
  'Travel',
  'Technology',
  'Gaming',
  'Beauty',
  'Motivation',
  'Photography',
  'Art',
]

export default function NicheIntelModule() {
  const { accountId } = useStudioContext()
  const [selectedNiche, setSelectedNiche] = useState('lifestyle')
  const [nicheData, setNicheData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalyze = async () => {
    try {
      setIsLoading(true)
      const response = await studioAPI.getNicheIntel(accountId, {
        niche: selectedNiche.toLowerCase(),
      })
      setNicheData(response.data.data)
    } catch (error) {
      console.error('Failed to analyze niche:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCompetitionColor = (level) => {
    switch (level) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      case 'medium':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20'
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getOpportunityColor = (level) => {
    switch (level) {
      case 'high':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      case 'medium':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20'
      case 'low':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const handleExport = () => {
    if (!nicheData) return

    const exportData = {
      niche: nicheData.niche,
      date: new Date().toISOString(),
      trendingHashtags: nicheData.trendingHashtags,
      competitors: nicheData.topCompetitors,
      postingTimes: nicheData.bestPostingTimes,
      contentGaps: nicheData.contentGaps,
      benchmarks: nicheData.engagementBenchmarks,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `niche-intel-${nicheData.niche}-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-500" />
            Niche Intelligence
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Competitive analysis and trending insights for your niche
          </p>
        </div>
        {nicheData && (
          <Button
            variant="outline"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        )}
      </div>

      {/* Niche Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Your Niche</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="niche">Niche</Label>
            <select
              id="niche"
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {NICHE_OPTIONS.map((niche) => (
                <option key={niche} value={niche}>
                  {niche}
                </option>
              ))}
            </select>
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Niche'}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {nicheData && (
        <div className="space-y-6">
          {/* Trending Hashtags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-purple-500" />
                Trending Hashtags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">Hashtag</th>
                      <th className="text-right py-3 px-2 font-semibold text-gray-900 dark:text-white">Volume</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900 dark:text-white">Competition</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900 dark:text-white">Relevance</th>
                      <th className="text-center py-3 px-2 font-semibold text-gray-900 dark:text-white">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nicheData.trendingHashtags.map((hashtag, idx) => (
                      <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-2 font-medium text-purple-600">{hashtag.tag}</td>
                        <td className="py-3 px-2 text-right text-gray-900 dark:text-white">
                          {hashtag.volume.toLocaleString()}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <Badge className={getCompetitionColor(hashtag.competition)}>
                            {hashtag.competition}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-center text-gray-900 dark:text-white">
                          {Math.round(hashtag.relevance * 100)}%
                        </td>
                        <td className="py-3 px-2 text-center">
                          <Badge className="bg-green-100 text-green-700">
                            {hashtag.growth}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Top Competitors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-500" />
                Top Competitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {nicheData.topCompetitors.map((competitor, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        #{idx + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {competitor.username}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {competitor.posts} posts
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {competitor.followers.toLocaleString()}
                      </p>
                      <Badge className="bg-purple-100 text-purple-700">
                        {competitor.engagement}% engagement
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Best Posting Times */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-500" />
                Best Posting Times
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Weekdays</h4>
                <div className="flex flex-wrap gap-2">
                  {nicheData.bestPostingTimes.weekdays.map((time, idx) => (
                    <Badge key={idx} className="bg-blue-100 text-blue-700">
                      {time}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Weekends</h4>
                <div className="flex flex-wrap gap-2">
                  {nicheData.bestPostingTimes.weekends.map((time, idx) => (
                    <Badge key={idx} className="bg-green-100 text-green-700">
                      {time}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Optimal Time</p>
                <p className="text-xl font-bold text-purple-600">
                  {nicheData.bestPostingTimes.optimal}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Content Gaps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" />
                Content Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {nicheData.contentGaps.map((gap, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {gap.topic}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {gap.searchVolume.toLocaleString()} monthly searches
                      </p>
                    </div>
                    <Badge className={getOpportunityColor(gap.opportunity)}>
                      {gap.opportunity} opportunity
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Engagement Benchmarks */}
          <Card className="border-2 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                Engagement Benchmarks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    {nicheData.engagementBenchmarks.averageLikes.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Likes</p>
                </div>
                <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-pink-600">
                    {nicheData.engagementBenchmarks.averageComments}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Comments</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">
                    {nicheData.engagementBenchmarks.averageShares}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Shares</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">
                    {nicheData.engagementBenchmarks.engagementRate}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
