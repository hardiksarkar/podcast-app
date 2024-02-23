import React from 'react'
import Header from '../components/Common/Header'
import CreatePodcastForm from '../components/StartAPodcast/CreatePodcastForm'

function CreateAPodcast() {
  return (
    <div className='create-a-podcast-div'>
      <Header/>
      <CreatePodcastForm/>
    </div>
  )
}

export default CreateAPodcast
