import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Code, Copy, Check, ChevronDown, ChevronRight } from 'lucide-react'
import CodeBlock from '../components/CodeBlock'

const endpoints = [
  {
    id: 'create-account',
    method: 'POST',
    path: '/api/create-account',
    title: 'Create Full Account',
    description: 'Creates both Gmail and Instagram accounts in one workflow',
    parameters: [
      { name: 'useAiProfile', type: 'boolean', required: false, default: 'true', description: 'Use AI to generate realistic profile' },
      { name: 'headless', type: 'boolean', required: false, default: 'false', description: 'Run browser in headless mode' },
      { name: 'proxyUrl', type: 'string', required: false, description: 'Proxy URL for the browser' },
      { name: 'uploadImages', type: 'boolean', required: false, default: 'true', description: 'Upload profile pictures and posts' },
      { name: 'initialPostCount', type: 'number', required: false, default: '9', description: 'Number of initial posts to create' },
    ],
    requestExample: `{
  "useAiProfile": true,
  "headless": false,
  "proxyUrl": "http://proxy.example.com:8080",
  "uploadImages": true,
  "initialPostCount": 9
}`,
    responseExample: `{
  "success": true,
  "jobId": "job_abc123",
  "message": "Account creation started",
  "estimatedTime": "5-7 minutes"
}`,
    curlExample: `curl -X POST http://localhost:3000/api/create-account \\
  -H "Content-Type: application/json" \\
  -d '{
    "useAiProfile": true,
    "headless": false,
    "proxyUrl": "http://proxy:8080"
  }'`
  },
  {
    id: 'create-gmail',
    method: 'POST',
    path: '/api/create-gmail',
    title: 'Create Gmail Account',
    description: 'Creates only a Gmail account',
    parameters: [
      { name: 'profile', type: 'object', required: false, description: 'User profile data' },
      { name: 'profile.firstName', type: 'string', required: true, description: 'First name' },
      { name: 'profile.lastName', type: 'string', required: true, description: 'Last name' },
      { name: 'profile.birthDate', type: 'string', required: true, description: 'Birth date (YYYY-MM-DD)' },
      { name: 'profile.gender', type: 'string', required: true, description: 'Gender (male/female/other)' },
      { name: 'headless', type: 'boolean', required: false, default: 'false', description: 'Run in headless mode' },
      { name: 'proxyUrl', type: 'string', required: false, description: 'Proxy URL' },
    ],
    requestExample: `{
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "birthDate": "1995-05-15",
    "gender": "male"
  },
  "headless": false,
  "proxyUrl": "http://proxy:8080"
}`,
    responseExample: `{
  "success": true,
  "account": {
    "email": "john.doe.1995@gmail.com",
    "password": "SecurePass123!",
    "recoveryEmail": "recovery@email.com"
  }
}`,
    curlExample: `curl -X POST http://localhost:3000/api/create-gmail \\
  -H "Content-Type: application/json" \\
  -d '{
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "birthDate": "1995-05-15",
      "gender": "male"
    }
  }'`
  },
  {
    id: 'create-instagram',
    method: 'POST',
    path: '/api/create-instagram',
    title: 'Create Instagram Account',
    description: 'Creates an Instagram account using existing Gmail',
    parameters: [
      { name: 'gmailAccount', type: 'object', required: true, description: 'Gmail credentials' },
      { name: 'gmailAccount.email', type: 'string', required: true, description: 'Gmail address' },
      { name: 'gmailAccount.password', type: 'string', required: true, description: 'Gmail password' },
      { name: 'profile', type: 'object', required: false, description: 'Instagram profile data' },
      { name: 'profile.username', type: 'string', required: false, description: 'Instagram username (auto-generated if not provided)' },
      { name: 'profile.fullName', type: 'string', required: false, description: 'Display name' },
      { name: 'headless', type: 'boolean', required: false, default: 'false', description: 'Run in headless mode' },
      { name: 'proxyUrl', type: 'string', required: false, description: 'Proxy URL' },
    ],
    requestExample: `{
  "gmailAccount": {
    "email": "john.doe.1995@gmail.com",
    "password": "SecurePass123!"
  },
  "profile": {
    "username": "johndoe95",
    "fullName": "John Doe"
  },
  "headless": false
}`,
    responseExample: `{
  "success": true,
  "account": {
    "username": "johndoe95",
    "email": "john.doe.1995@gmail.com",
    "fullName": "John Doe",
    "profileUrl": "https://instagram.com/johndoe95"
  }
}`,
    curlExample: `curl -X POST http://localhost:3000/api/create-instagram \\
  -H "Content-Type: application/json" \\
  -d '{
    "gmailAccount": {
      "email": "john@gmail.com",
      "password": "pass123"
    },
    "profile": {
      "username": "johndoe95"
    }
  }'`
  },
  {
    id: 'get-accounts',
    method: 'GET',
    path: '/api/accounts',
    title: 'Get All Accounts',
    description: 'Retrieves all created accounts with optional filtering',
    parameters: [
      { name: 'status', type: 'string', required: false, description: 'Filter by status (active/pending/failed)' },
      { name: 'limit', type: 'number', required: false, default: '50', description: 'Number of accounts to return' },
      { name: 'offset', type: 'number', required: false, default: '0', description: 'Pagination offset' },
    ],
    requestExample: null,
    responseExample: `{
  "success": true,
  "total": 150,
  "accounts": [
    {
      "id": "acc_123",
      "gmailEmail": "user1@gmail.com",
      "instagramUsername": "user1_insta",
      "status": "active",
      "createdAt": "2025-10-29T10:00:00Z"
    }
  ]
}`,
    curlExample: `curl http://localhost:3000/api/accounts?status=active&limit=10`
  },
  {
    id: 'get-account',
    method: 'GET',
    path: '/api/accounts/:id',
    title: 'Get Account by ID',
    description: 'Retrieves detailed information about a specific account',
    parameters: [
      { name: 'id', type: 'string', required: true, description: 'Account ID' },
    ],
    requestExample: null,
    responseExample: `{
  "success": true,
  "account": {
    "id": "acc_123",
    "gmailEmail": "user@gmail.com",
    "gmailPassword": "encrypted",
    "instagramUsername": "user_insta",
    "instagramPassword": "encrypted",
    "status": "active",
    "profile": {
      "firstName": "John",
      "lastName": "Doe",
      "birthDate": "1995-05-15"
    },
    "createdAt": "2025-10-29T10:00:00Z",
    "lastActive": "2025-10-29T15:30:00Z"
  }
}`,
    curlExample: `curl http://localhost:3000/api/accounts/acc_123`
  },
  {
    id: 'delete-account',
    method: 'DELETE',
    path: '/api/accounts/:id',
    title: 'Delete Account',
    description: 'Deletes an account from the database',
    parameters: [
      { name: 'id', type: 'string', required: true, description: 'Account ID to delete' },
    ],
    requestExample: null,
    responseExample: `{
  "success": true,
  "message": "Account deleted successfully"
}`,
    curlExample: `curl -X DELETE http://localhost:3000/api/accounts/acc_123`
  },
  {
    id: 'get-stats',
    method: 'GET',
    path: '/api/stats',
    title: 'Get Statistics',
    description: 'Retrieves platform statistics and metrics',
    parameters: [],
    requestExample: null,
    responseExample: `{
  "success": true,
  "stats": {
    "totalAccounts": 150,
    "activeAccounts": 145,
    "pendingAccounts": 3,
    "failedAccounts": 2,
    "successRate": 97.3,
    "last24Hours": 12,
    "last7Days": 85
  }
}`,
    curlExample: `curl http://localhost:3000/api/stats`
  },
  {
    id: 'get-activities',
    method: 'GET',
    path: '/api/activities',
    title: 'Get Activities',
    description: 'Retrieves recent platform activities',
    parameters: [
      { name: 'limit', type: 'number', required: false, default: '20', description: 'Number of activities to return' },
    ],
    requestExample: null,
    responseExample: `{
  "success": true,
  "activities": [
    {
      "id": "act_123",
      "type": "account_created",
      "accountId": "acc_123",
      "message": "Instagram account created successfully",
      "timestamp": "2025-10-29T15:30:00Z"
    }
  ]
}`,
    curlExample: `curl http://localhost:3000/api/activities?limit=50`
  }
]

export default function APIReference() {
  const [expandedEndpoint, setExpandedEndpoint] = useState('create-account')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float animation-delay-2000"></div>
      </div>

      {/* Header */}
      <div className="glass border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
              <div className="w-px h-6 bg-white/10"></div>
              <div className="flex items-center space-x-3">
                <Code className="w-6 h-6 text-purple-400" />
                <h1 className="text-xl font-bold gradient-text">API Reference</h1>
              </div>
            </div>
            <Link
              to="/docs"
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm"
            >
              View Docs
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-black gradient-text mb-4">API Reference</h2>
          <p className="text-xl text-gray-300 max-w-3xl">
            Complete REST API documentation for MyG InstaBot. All endpoints return JSON responses 
            and use standard HTTP status codes.
          </p>

          {/* Base URL */}
          <div className="mt-6 glass p-6 rounded-xl border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white mb-2">Base URL</h3>
                <code className="text-purple-300 text-lg">http://localhost:3000</code>
              </div>
              <div className="text-right">
                <h3 className="font-bold text-white mb-2">Authentication</h3>
                <span className="text-gray-400">None required (add your own!)</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Endpoints */}
        <div className="space-y-4">
          {endpoints.map((endpoint, index) => (
            <motion.div
              key={endpoint.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass rounded-xl border border-white/10 overflow-hidden"
            >
              {/* Endpoint Header */}
              <button
                onClick={() => setExpandedEndpoint(expandedEndpoint === endpoint.id ? null : endpoint.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <span className={`
                    px-3 py-1 rounded-lg font-mono text-sm font-bold
                    ${endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-300' : 
                      endpoint.method === 'POST' ? 'bg-green-500/20 text-green-300' : 
                      'bg-red-500/20 text-red-300'}
                  `}>
                    {endpoint.method}
                  </span>
                  <code className="text-gray-300 font-mono">{endpoint.path}</code>
                  <span className="text-gray-400">-</span>
                  <span className="text-white font-semibold">{endpoint.title}</span>
                </div>
                {expandedEndpoint === endpoint.id ? (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {/* Endpoint Details */}
              <AnimatePresence>
                {expandedEndpoint === endpoint.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-white/10"
                  >
                    <div className="p-6 space-y-6">
                      {/* Description */}
                      <p className="text-gray-300">{endpoint.description}</p>

                      {/* Parameters */}
                      {endpoint.parameters.length > 0 && (
                        <div>
                          <h4 className="font-bold text-white mb-3">Parameters</h4>
                          <div className="space-y-2">
                            {endpoint.parameters.map((param) => (
                              <div key={param.name} className="glass p-4 rounded-lg border border-white/5">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center space-x-3">
                                    <code className="text-purple-300 font-mono">{param.name}</code>
                                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded text-xs font-mono">
                                      {param.type}
                                    </span>
                                    {param.required && (
                                      <span className="px-2 py-0.5 bg-red-500/20 text-red-300 rounded text-xs font-bold">
                                        REQUIRED
                                      </span>
                                    )}
                                  </div>
                                  {param.default && (
                                    <span className="text-xs text-gray-400">
                                      default: <code className="text-gray-300">{param.default}</code>
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-400">{param.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Request Example */}
                      {endpoint.requestExample && (
                        <div>
                          <h4 className="font-bold text-white mb-3">Request Body</h4>
                          <CodeBlock
                            code={endpoint.requestExample}
                            language="json"
                            filename="request.json"
                          />
                        </div>
                      )}

                      {/* Response Example */}
                      <div>
                        <h4 className="font-bold text-white mb-3">Response</h4>
                        <CodeBlock
                          code={endpoint.responseExample}
                          language="json"
                          filename="response.json"
                        />
                      </div>

                      {/* cURL Example */}
                      <div>
                        <h4 className="font-bold text-white mb-3">Example Request</h4>
                        <CodeBlock
                          code={endpoint.curlExample}
                          language="bash"
                          filename="curl"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Status Codes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 glass p-8 rounded-xl border border-white/10"
        >
          <h3 className="text-2xl font-bold gradient-text mb-6">HTTP Status Codes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { code: 200, message: 'OK - Request successful' },
              { code: 201, message: 'Created - Resource created successfully' },
              { code: 400, message: 'Bad Request - Invalid parameters' },
              { code: 404, message: 'Not Found - Resource not found' },
              { code: 500, message: 'Server Error - Internal server error' },
              { code: 503, message: 'Service Unavailable - Server overloaded' },
            ].map((status) => (
              <div key={status.code} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <code className={`
                  px-3 py-1 rounded font-mono font-bold
                  ${status.code < 300 ? 'bg-green-500/20 text-green-300' : 
                    status.code < 400 ? 'bg-blue-500/20 text-blue-300' : 
                    status.code < 500 ? 'bg-yellow-500/20 text-yellow-300' : 
                    'bg-red-500/20 text-red-300'}
                `}>
                  {status.code}
                </code>
                <span className="text-gray-300">{status.message}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* WebSocket Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 glass p-8 rounded-xl border border-purple-500/20"
        >
          <h3 className="text-2xl font-bold gradient-text mb-4">Real-Time Updates (WebSocket)</h3>
          <p className="text-gray-300 mb-4">
            Connect to the WebSocket server for real-time account creation updates and activity feeds.
          </p>
          <CodeBlock
            language="javascript"
            filename="websocket-example.js"
            code={`import io from 'socket.io-client';

const socket = io('http://localhost:3000');

// Listen for account creation updates
socket.on('account:created', (data) => {
  console.log('New account created:', data);
});

// Listen for job progress
socket.on('job:progress', (data) => {
  console.log('Job progress:', data);
});

// Listen for activities
socket.on('activity:new', (activity) => {
  console.log('New activity:', activity);
});`}
          />
        </motion.div>
      </div>
    </div>
  )
}

