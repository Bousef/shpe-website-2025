"use client";

import { api } from '~/trpc/react'

export default function ProfileCard() {
	// const session = useSession()
	// grab the ucf id stashed in the user's metadata at signup
  // const ucfId = session?.user?.user_metadata?.ucf_id
  //   ? Number(session.user.user_metadata.ucf_id)
  //   : undefined

	// call existing getMember endpoint
  const {
    data: profile,
    isLoading,
    error,
  } = api.user.getCurrentMember.useQuery();
	// if not signed in
	// if (!session) return <p>Please sign in</p>

	// if still loading
  if (isLoading) return <p>Loading profile…</p>
	if (!profile)  return <p>You are not logged in.</p>
	// if query error
  if (error) return <p>Error: {error.message}</p>
	

	return (
		<main id="profile" className="relative bg-white py-10 px-15 text-[var(--shpe-navy-blue)] max-w-4xl mx-auto h-150">
			<section className="flex items-stretch space-x-5 p-6 bg-[var(--shpe-light-blue)] h-full shadow-sm">
				{/* LEFT */}
				<div className="w-1/3 bg-[#b3cad6] rounded flex flex-col items-center">
					{profile.image &&
						<img 
							src={profile.image}
							alt="Profile"
							className="w-50 h-50 object-cover mt-5 mb-2"
						/>
					}
					<div className="text-center">
						<h2 className="font-bold text-lg">{profile.first_name}</h2>
						<p className="text-sm">{profile.last_name}</p>
					</div>
					<div className="text-center space-y-1">
						<p className="text-xs">Member ID/UCF ID</p>
						<p className="font-mono font-bold text-xl>">{profile.ucf_id}</p>
					</div>
					<img src="/assets/round_logo.png" alt="SHPE UCF Logo" className="h-30 w-30 mt-2" />
				</div>

				{/* RIGHT */}
				<div className="w-2/3 flex flex-col h-full gap-5">
					{/* MEMBER DETAILS */}
					<div className="bg-[#b3cad6] rounded p-6 overflow-auto flex-1">
						<h2 className="text-2xl font-bold mb-3 font-helios tracking-[0.1em]">MEMBER DETAILS</h2>
						<dl className="space-y-1 text-md">
							<div className="flex">
								<dt className="w-24 font-semibold">Name:</dt>
								<dd>{profile.first_name} {profile.last_name}</dd>
							</div>
							<div className="flex">
								<dt className="w-24 font-semibold">Major:</dt>
								<dd>HARDCODED ATM: Computer Science B.S.</dd>
							</div>
							<div className="flex">
								<dt className="w-24 font-semibold">Email:</dt>
								<dd>{profile.email}</dd>
							</div>
							<div className="flex">
								<dt className="w-24 font-semibold">Phone:</dt>
								<dd>HARDCODED ATM: 123-456-7890</dd>
							</div>		
						</dl>
					</div>
					{/* BECOME A MEMBER */}
					<div className="bg-[#b3cad6] rounded p-6 overflow-auto flex-none">
						<h3 className="text-lg font-bold mb-2">HAVEN'T PAID YOUR DUES?</h3>
						<p className="text-md mb-4">Pay below to become a SHPEofficial! 🗣️</p>
						<a
							href="https://form.jotform.com/70387424224151"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center
								bg-[#f2ac02] hover:bg-[#e0a200]
								text-black font-helvetica
								text-base sm:text-lg font-bold
								tracking-[0.3em]
								px-7 py-3
								rounded-full
								transition-all duration-200
								shadow-md hover:scale-105"
						>
							MEMBERSHIP
							<img src="/assets/arrow.png" alt="→" className="ml-2 w-5 h-5" />
						</a>	
					</div>					
				</div>
			</section>
		</main>
	)
}