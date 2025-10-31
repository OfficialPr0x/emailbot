import { useState } from 'react'
import { Users, Target, Search, TrendingUp, MapPin, Calendar, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import studioAPI from '@/services/studioAPI'
import { useStudioContext } from '@/contexts/StudioContext'

export default function AudienceBuilderModule() {
  const { accountId } = useStudioContext()
  const [activeTab, setActiveTab] = useState('profile') // profile, similar, research
  const [isLoading, setIsLoading] = useState(false)
  
  // Audience Profile State
  const [audienceProfile, setAudienceProfile] = useState({
    interests: '',
    location: 'Global',
    ageRange: '25-34',
  })
  const [audienceData, setAudienceData] = useState(null)

  // Similar Accounts State
  const [targetAccount, setTargetAccount] = useState('')
  const [similarAccounts, setSimilarAccounts] = useState(null)

  const handleResearchAudience = async () => {
    try {
      setIsLoading(true)
      const interests = audienceProfile.interests
        .split(',')
        .map(i => i.trim())
        .filter(Boolean)

      const response = await studioAPI.researchAudience(accountId, {
        interests,
        location: audienceProfile.location,
        ageRange: audienceProfile.ageRange,
      })

      setAudienceData(response.data.data)
    } catch (error) {
      console.error('Failed to research audience:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFindSimilar = async () => {
    try {
      setIsLoading(true)
      const response = await studioAPI.findSimilarAccounts(accountId, {
        targetAccount,
      })
      setSimilarAccounts(response.data.data)
    } catch (error) {
      console.error('Failed to find similar accounts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderProfileBuilder = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            Define Your Ideal Follower
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="interests">Interests</Label>
            <Input
              id="interests"
              value={audienceProfile.interests}
              onChange={(e) => setAudienceProfile({ ...audienceProfile, interests: e.target.value })}
              placeholder="Fitness, Nutrition, Wellness"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Comma-separated interests
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={audienceProfile.location}
                onChange={(e) => setAudienceProfile({ ...audienceProfile, location: e.target.value })}
                placeholder="United States"
              />
            </div>
            <div>
              <Label htmlFor="ageRange">Age Range</Label>
              <select
                id="ageRange"
                value={audienceProfile.ageRange}
                onChange={(e) => setAudienceProfile({ ...audienceProfile, ageRange: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="18-24">18-24</option>
                <option value="25-34">25-34</option>
                <option value="35-44">35-44</option>
                <option value="45-54">45-54</option>
                <option value="55+">55+</option>
              </select>
            </div>
          </div>

          <Button
            onClick={handleResearchAudience}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            {isLoading ? (
              'Analyzing...'
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Research Audience
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Audience Research Results */}
      {audienceData && (
        <div className="space-y-4">
          {/* Demographics */}
          <Card>
            <CardHeader>
              <CardTitle>Demographics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Age Range</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {audienceData.targetProfile.demographics.ageRange}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Gender Split</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {audienceData.targetProfile.demographics.gender}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Location</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {audienceData.targetProfile.demographics.location}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400 block mb-2">Top Languages</span>
                <div className="flex flex-wrap gap-2">
                  {audienceData.targetProfile.demographics.languages.map((lang, idx) => (
                    <Badge key={idx} className="bg-purple-100 text-purple-700">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Psychographics */}
          <Card>
            <CardHeader>
              <CardTitle>Psychographics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {audienceData.targetProfile.psychographics.interests.map((interest, idx) => (
                    <Badge key={idx} className="bg-blue-100 text-blue-700">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Core Values</h4>
                <div className="flex flex-wrap gap-2">
                  {audienceData.targetProfile.psychographics.values.map((value, idx) => (
                    <Badge key={idx} className="bg-green-100 text-green-700">
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Pain Points</h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {audienceData.targetProfile.psychographics.painPoints.map((pain, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-orange-500 mt-0.5">•</span>
                      {pain}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Online Behavior */}
          <Card>
            <CardHeader>
              <CardTitle>Online Behavior</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Active Hours</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {audienceData.targetProfile.onlineBehavior.activeHours}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Peak Engagement</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {audienceData.targetProfile.onlineBehavior.peakEngagement}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400 block mb-2">Preferred Content</span>
                <div className="flex flex-wrap gap-2">
                  {audienceData.targetProfile.onlineBehavior.preferredContent.map((content, idx) => (
                    <Badge key={idx} className="bg-pink-100 text-pink-700">
                      {content}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Hashtags */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Hashtags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {audienceData.recommendedHashtags.map((tag, idx) => (
                  <Badge key={idx} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Growth Projections */}
          <Card className="border-2 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                Growth Projections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {audienceData.projectedGrowth.followers30Days}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">30 Days</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {audienceData.projectedGrowth.followers90Days}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">90 Days</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {audienceData.projectedGrowth.engagementRate}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Engagement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )

  const renderSimilarAccounts = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-purple-500" />
            Find Similar Accounts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="targetAccount">Target Account Username</Label>
            <div className="flex gap-2">
              <Input
                id="targetAccount"
                value={targetAccount}
                onChange={(e) => setTargetAccount(e.target.value)}
                placeholder="@competitor_account"
              />
              <Button
                onClick={handleFindSimilar}
                disabled={isLoading || !targetAccount}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Find accounts similar to your competitors
            </p>
          </div>
        </CardContent>
      </Card>

      {similarAccounts && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Similar to {similarAccounts.targetAccount}
          </h3>
          {similarAccounts.similarAccounts.map((account, idx) => (
            <Card key={idx} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {account.username}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {account.followers.toLocaleString()} followers
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-700">
                        {account.engagement}% engagement
                      </Badge>
                    </div>
                    <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                      {Math.round(account.similarity * 100)}% similarity
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Users className="w-8 h-8 text-purple-500" />
          Audience Builder
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Research and define your ideal target audience
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'profile'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Target className="w-4 h-4 inline mr-2" />
          Audience Profile
        </button>
        <button
          onClick={() => setActiveTab('similar')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'similar'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Search className="w-4 h-4 inline mr-2" />
          Similar Accounts
        </button>
      </div>

      {/* Content */}
      {activeTab === 'profile' && renderProfileBuilder()}
      {activeTab === 'similar' && renderSimilarAccounts()}
    </div>
  )
}
