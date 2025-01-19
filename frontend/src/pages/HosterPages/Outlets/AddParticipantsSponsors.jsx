import { useContext, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus, Building2, Trash2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ParticipantsSponsers from '@/Page_components/CloudinaryComponents/ParticipantsSponsers'
import { EventDetailsDataContext } from '@/ContextFiles/EventDetailsProvider'
import { toast } from 'sonner'
import axiosInstance from '@/axiosconfig'
import { useNavigate } from 'react-router-dom'

export default function AddParticipantsSponsors() {
  const navigate = useNavigate()
  const { data, loading, error, refreshData, setLoading } = useContext(EventDetailsDataContext)
  const [participants, setParticipants] = useState([])
  // const [sponsors, setSponsors] = useState([])
  const [newParticipant, setNewParticipant] = useState({ photo: '', name: '', role: '', bio: '', event: null })
  const [photoPublicId, setPhotoPublicId] = useState();

  useEffect(() => {
    if (data) {
      const key_participants_data = data?.event_data?.key_participants

      const updatedParticipants = key_participants_data.map((participant) => ({
        ...participant,
        id: Date.now() + Math.random()
      }));

      setParticipants(updatedParticipants);

      console.log("Participants updated:", updatedParticipants);
    }
  }, [data])

  // const [newSponsor, setNewSponsor] = useState({ name: '', level: '', description: '' })

  const addParticipant = async (e) => {
    e.preventDefault()
    console.log(participants)
    // Assuming `cateData` contains the event details.

    await toast.promise(
      axiosInstance.post(
        `/events/event/${data?.event_data?.id}/key_participants/`,
        { key_participants: participants }
      ),
      {
        loading: `Updating event key participants...`,
        success: () => {
          refreshData();
          navigate(`/hoster/events/event/${data?.event_data?.id}`)
          return `Key participants has been added successfully!`;
        },
        error: (err) => {
          console.error("Error updating approval status:", err);
          return `Failed to add the key participants. Please try again.`;
        },
      }
    );
  };

  const addData = (e) => {
    e.preventDefault()
    if (newParticipant.name && newParticipant.role) {
      setParticipants([...participants, { ...newParticipant, id: Date.now() + Math.random(), event: data?.event_data?.id }])
      setNewParticipant({ photo: '', name: '', role: '', bio: '' })
    }
  }

  // const addSponsor = (e) => {
  //   e.preventDefault()
  //   if (newSponsor.name && newSponsor.level) {
  //     setSponsors([...sponsors, { ...newSponsor, id: Date.now() }])
  //     setNewSponsor({ name: '', level: '', description: '' })
  //   }
  // }

  const removeParticipant = (id) => {
    setParticipants(participants.filter(p => p.id !== id))
  }

  useEffect(() => {
    console.log('public id cloudinary', photoPublicId)
    if (photoPublicId) {
      setNewParticipant({ ...newParticipant, photo: photoPublicId })
      setPhotoPublicId()
    }
  }, [photoPublicId]);

  // const removeSponsor = (id) => {
  //   setSponsors(sponsors.filter(s => s.id !== id))
  // }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;


  return (
    <div className=" container mx-auto pt-0 p-4 overflow-hidden space-y-8 h-max flex-col ">
      <h1 className="text-3xl font-bold text-center mb-3">Add Key Participants and Sponsors</h1>
      <form onSubmit={addParticipant} className="space-y-4">
        <div className="grid md:grid-cols-2  gap-8">
          <Card className='h-[500px] overflow-y-auto '>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-6 w-6" />
                Add Key Participant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">


              <div className='flex justify-start items-center gap-2' >
                <Avatar className="h-28 w-28">
                  <AvatarImage className='object-cover' src={`https://res.cloudinary.com/dzwjm8n8v/image/upload/v1732125377/${newParticipant.photo}.jpg`} />
                  <AvatarFallback>Photo</AvatarFallback>
                </Avatar>
                <ParticipantsSponsers publicId={photoPublicId} setPublicId={setPhotoPublicId} folder={'key_participants'} />
              </div>

              <div>
                <Input
                  id="participantName"
                  value={newParticipant.name}
                  onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
                  placeholder="Enter participant name"

                />
              </div>
              <div>
                <Input
                  id="participantRole"
                  value={newParticipant.role}
                  onChange={(e) => setNewParticipant({ ...newParticipant, role: e.target.value })}
                  placeholder="Enter participant role"

                />
              </div>
              <div>

                <Textarea
                  id="participantBio"
                  value={newParticipant.bio}
                  onChange={(e) => setNewParticipant({ ...newParticipant, bio: e.target.value })}
                  placeholder="Enter participant bio"
                  rows={3}
                />
              </div>
              <Button type="button" onClick={(e) => addData(e)} className="w-full">Add Participant</Button>

            </CardContent>
          </Card>

          {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              Add Sponsor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addSponsor} className="space-y-4">
              <div>
                <Label htmlFor="sponsorName">Name</Label>
                <Input
                  id="sponsorName"
                  value={newSponsor.name}
                  onChange={(e) => setNewSponsor({...newSponsor, name: e.target.value})}
                  placeholder="Enter sponsor name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="sponsorLevel">Sponsorship Level</Label>
                <Input
                  id="sponsorLevel"
                  value={newSponsor.level}
                  onChange={(e) => setNewSponsor({...newSponsor, level: e.target.value})}
                  placeholder="Enter sponsorship level"
                  required
                />
              </div>
              <div>
                <Label htmlFor="sponsorDescription">Description</Label>
                <Textarea
                  id="sponsorDescription"
                  value={newSponsor.description}
                  onChange={(e) => setNewSponsor({...newSponsor, description: e.target.value})}
                  placeholder="Enter sponsor description"
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full">Add Sponsor</Button>
            </form>
          </CardContent>
        </Card> */}

          <Card className='h-[500px] overflow-y-auto ' >
            <CardHeader>
              <CardTitle>Key Participants</CardTitle>
            </CardHeader>
            <CardContent>
              {participants.length === 0 ? (
                <p className="text-center text-gray-500">No participants added yet.</p>
              ) : (
                <ul className="space-y-4">
                  {participants.map((participant) => (
                    <li key={participant.id} className="flex items-center justify-between border bg-zinc-900 p-4 rounded-lg">
                      <div className='flex items-center justify-between gap-3'>
                        <Avatar className="h-16 w-16">
                          <AvatarImage className='object-cover' src={`https://res.cloudinary.com/dzwjm8n8v/image/upload/v1732125377/${participant.photo}.jpg`} />
                          <AvatarFallback>Photo</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{participant.name}</h3>
                          <p className="text-sm text-gray-600">{participant.role}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeParticipant(participant.id)}
                        aria-label={`Remove ${participant.name}`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <Button type='submit' >Submit participants</Button>
      </form>

      {/*<div className="grid md:grid-cols-2 gap-8 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Key Participants</CardTitle>
          </CardHeader>
          <CardContent>
            {participants.length === 0 ? (
              <p className="text-center text-gray-500">No participants added yet.</p>
            ) : (
              <ul className="space-y-4">
                {participants.map((participant) => (
                  <li key={participant.id} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                    <div>
                      <h3 className="font-semibold">{participant.name}</h3>
                      <p className="text-sm text-gray-600">{participant.role}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeParticipant(participant.id)}
                      aria-label={`Remove ${participant.name}`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card> */}

      {/* <Card>
          <CardHeader>
            <CardTitle>Sponsors</CardTitle>
          </CardHeader>
          <CardContent>
            {sponsors.length === 0 ? (
              <p className="text-center text-gray-500">No sponsors added yet.</p>
            ) : (
              <ul className="space-y-4">
                {sponsors.map((sponsor) => (
                  <li key={sponsor.id} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                    <div>
                      <h3 className="font-semibold">{sponsor.name}</h3>
                      <p className="text-sm text-gray-600">{sponsor.level}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSponsor(sponsor.id)}
                      aria-label={`Remove ${sponsor.name}`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>  */}
    </div>
  )
}