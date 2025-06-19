export default function ProfileCard() {
	return (
		<main id="profile" className="relative bg-white py-10 px-15 text-[var(--shpe-navy-blue)]">
			<section className="flex items-stretch space-x-4 p-5 bg-[var(--shpe-blue)]">
				{/* LEFT COLUMN */}
				<div className="w-1/5 bg-[var(--shpe-light-blue)] rounded p-4">
					<img 
						src="/path/to/photo.jpg"
						alt="Profile"
						className="w-32 h-32 object-cover"
					/>
					<div className="text-center">
						<h2 className="font-bold text-lg">FIRST_NAME</h2>
						<p className="text-sm">SURNAME</p>
					</div>
					<div className="text-center space-y-1">
						<p className="font-mono text-xl">XXXXXX</p>
						<p className="text-xs">Member ID</p>
						<p className="font-mono text-xl>">XXXXXX</p>
						<p className="text-xs">UCF ID</p>
					</div>
					<img src="shpeucf.png" alt="SHPE UCF Logo" className="w-20" />
				</div>

				{/* MID COLUMN */}
				<div className="w-2/3 flex flex-col gap-5">
					<div className="bg-[var(--shpe-light-blue)] rounded p-4 overflow-auto">
						<h2 className="text-xl font-bold mb-3">MEMBER DETAILS</h2>
						<dl className="space-y-1 text-sm">
							<div className="flex">
								<dt className="w-24 font-semibold">Name:</dt>
								<dd>FULL_NAME</dd>
							</div>
							<div className="flex">
								<dt className="w-24 font-semibold">Email:</dt>
								<dd>example@ucf.edu</dd>
							</div>
							<div className="flex">
								<dt className="w-24 font-semibold">Address:</dt>
								<dd>MAYBE REMOVING THIS PART</dd>
							</div>
							<div className="flex">
								<dt className="w-24 font-semibold">Phone:</dt>
								<dd>123-456-7890</dd>
							</div>		
						</dl>
					</div>

					<div className="bg-[var(--shpe-light-blue)] rounded p-4 overflow-auto">
						<h2 className="text-xl font-bold mb-3">BIO</h2>
						<p>sorry unavailable thanks for your understanding...</p>
					</div>					
				</div>

				{/* RIGHT COLUMN */}
				<div className="w-1/5 bg-[var(--shpe-light-blue)] rounded text-center p-4">
					<h3 className="font-bold mb-2">HAVEN'T PAID YOUR DUES?</h3>
					<p className="text-sm mb-4">Pay below to become a SHPEofficial! 🗣️</p>
					<button className="inline-flex items-center bg-yellow-500 px-5 py-3 rounded-full font-semibold">
						<span className="mr-2">MEMBERSHIP</span>
						<img src="/assets/arrow.png" alt="Become a Member!" className="w-5 h-5"/>
					</button>
				</div>
			</section>
		</main>
	)
}