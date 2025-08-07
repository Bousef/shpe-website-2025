"use client";

import { api } from '~/trpc/react';
import { useEffect, useState } from "react";
import ProfileEdit from './ProfileEdit';

export default function ProfileCard() {
	const [sessionChecked, setSessionChecked] = useState(false);
	const [showResume, setShowResume] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [cursorHistory, setCursorHistory] = useState<(string | undefined)[]>([undefined]); // for going back
	const [cursorIndex, setCursorIndex] = useState(0);
	const [page, setPage] = useState(1);
	const orderCursor = cursorHistory[cursorIndex]; // for querying

	useEffect(() => {
		setSessionChecked(true);
	}, []);

	// call existing getMember endpoint
	const {
		data: profile,
		isLoading,
		error,
		refetch: refetchProfile,
	} = api.user.getCurrentMember.useQuery(undefined, {
		enabled: sessionChecked,
	})

	// create orders
	const [createdData, setCreatedData] = useState<{
		customerId: string;
		orderId: string;
	} | null>(null);

	const { mutate: createTestOrder, isPending: creatingTestOrder } = api.square.orders.createTestOrder.useMutation({
		onSuccess: (data) => {
			console.log("Test order created:", data);
			if (data.customerId && data.orderId) {
				setCreatedData({
					customerId: data.customerId,
					orderId: data.orderId,
				});

				// optionally refetch orders if a real customerId is returned
				if (data.customerId === profile?.square_customer_id) {
					refetchOrders(); // only works if refetch function is available from useQuery
				}
			}
		}, 
		onError: (err) => {
			console.error("Failed to create test order:", err);
			alert("Failed to create test order");
		},
	});

	// fetch orders
	const {
		data: ordersData,
		isLoading: ordersLoading,
		error: ordersError,
		refetch: refetchOrders,
	} = api.square.orders.getOrdersForMember.useQuery(
		{ customerId: profile?.square_customer_id ?? "", cursor: orderCursor },
		{ enabled: !!profile?.square_customer_id, } // avoids calling with undefined
	); 
	
	const orders = ordersData && !Array.isArray(ordersData) && 'orders' in ordersData
		? ordersData.orders
		: [];
	
	// sum all order totals (square stores amounts in cents, so divide by 100)
	const totalSpent = orders.reduce(
		(sum, order) => sum + Number(order.totalMoney?.amount ?? 0),
		0
	) / 100;

	// pagination of order receipts
	const hasNextPage = ordersData && !Array.isArray(ordersData) && ordersData.cursor;
	const handleNextPage = () => {
		if (hasNextPage) {
			const newCursorStack = [
				...cursorHistory.slice(0, cursorIndex + 1),
				ordersData.cursor ?? undefined,
			];			
			setCursorHistory(newCursorStack);
    		setCursorIndex(cursorIndex + 1);			
			setPage((prev) => prev + 1);
		}
	};
	const handlePrevPage = () => {
		if (cursorIndex > 0) {
			setCursorIndex(cursorIndex - 1);
			setPage((prev) => prev - 1);
		}
	};
	
	if (!sessionChecked || isLoading) return <p>Loading profile…</p>
	if (!profile) return <p>No profile found for this user.</p>;
	if (error) return <p>Error: {error.message}</p>;

	return (
		<main id="profile" className="relative bg-white py-10 px-15 text-[var(--shpe-navy-blue)] min-w-6xl mx-auto min-h-[80vh]">
			<div className='flex flex-row gap-5 h-full'>
				<section className="w-1/2 flex items-stretch space-x-5 p-5 bg-[var(--shpe-light-blue)] shadow-sm">
					{/* LEFT */}
					<div className="w-1/3 bg-[#b3cad6] rounded flex flex-col items-center">
						{profile.image &&
							<img 
								src={profile.image}
								alt="Profile"
								className="w-50 h-50 object-cover mt-5 mb-2"
							/>
						}
						<div className="text-center mt-3">
							<h2 className="font-bold text-3xl uppercase">{profile.first_name}</h2>
							<p className="text-md uppercase">{profile.last_name}</p>
						</div>
						<div className="text-center mt-3 space-y-1">
							<p className="font-bold text-2xl">{profile.ucf_id}</p>
							<p className="text-sm tracking-[0.1em]">MEMBER ID</p>
						</div>
						<div className="text-center mt-3 space-y-1">
							<p className={`font-bold text-2xl ${profile.is_member ? "text-green-600" : "text-red-600"}`}>
								{profile.ucf_id}
							</p>
							<p className="text-sm tracking-[0.1em]">UCF ID</p>
						</div>
						<img src="/assets/round_logo.png" alt="SHPE UCF Logo" className="h-30 w-30 mt-2" />
					</div>

					{/* RIGHT */}
					<div className="w-2/3 flex flex-col h-full gap-5">
						{/* MEMBER DETAILS */}
						<div className="bg-[#b3cad6] rounded p-6 overflow-auto flex-1">
							<h2 className="text-2xl font-bold mb-3 font-helios tracking-[0.1em]">MEMBER DETAILS</h2>
							<dl className="space-y-1 text-lg">
								<div className="flex">
									<dt className="w-30 font-semibold">Name:</dt>
									<dd>{profile.first_name} {profile.last_name}</dd>
								</div>
								<div className="flex">
									<dt className="w-30 font-semibold">Major:</dt>
									<dd>{profile.major}</dd>
								</div>
								<div className="flex">
									<dt className="w-30 font-semibold">Email:</dt>
									<dd>{profile.email}</dd>
								</div>
								<div className="flex">
									<dt className="w-30 font-semibold">Phone:</dt>
									<dd>{profile.phone_number
										? profile.phone_number.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
										: ""}
									</dd>
								</div>
							</dl>
							<div className="mt-10">
								<button
									onClick={() => setShowResume(true)}
									className="inline-flex items-center justify-center
										bg-[#f2ac02] hover:bg-[#e0a200]
										text-black font-helvetica
										text-base sm:text-md font-bold
										tracking-[0.1em]
										px-7 py-3
										rounded-full
										transition-all duration-200
										shadow-md hover:scale-105
										cursor-pointer"
								>
									VIEW RESUME
									<img src="/assets/arrow.png" alt="→" className="ml-2 w-5 h-5" />
								</button>
							</div>
							<div className="mt-5">
								<button
									onClick={() => setShowEdit(true)}
									className="inline-flex items-center justify-center
										bg-[#f2ac02] hover:bg-[#e0a200]
										text-black font-helvetica
										text-base sm:text-md font-bold
										tracking-[0.1em]
										px-7 py-3
										rounded-full
										transition-all duration-200
										shadow-md hover:scale-105"
								>
									EDIT PROFILE
									<img src="/assets/arrow.png" alt="→" className="ml-2 w-5 h-5" />
								</button>
							</div>
						</div>
						{/* BECOME A MEMBER */}
						<div className="bg-[#b3cad6] rounded p-6 overflow-auto flex-none">
							<h3 className="text-lg font-bold mb-2">HAVEN'T PAID YOUR DUES?</h3>
							<p className="text-md mb-4">Pay below to become a <strong>SHPEofficial</strong>! 🗣️</p>
							<a
								href="https://form.jotform.com/70387424224151"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-center
									bg-[#f2ac02] hover:bg-[#e0a200]
									text-black font-helvetica
									text-base sm:text-lg font-bold
									tracking-[0.3em]
									px-10 py-4
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

				{showResume && (
					<div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
						<div className="bg-white w-11/12 max-w-6xl rounded-lg shadow-lg overflow-hidden">
							<div className="flex justify-between items-center p-4 border-b">
								<h3 className="text-xl font-semibold">Resume</h3>
								<button
									onClick={() => setShowResume(false)}
									className="text-lg text-gray-500 hover:text-red-500"
								>
								✕
								</button>
							</div>
							<div className="p-4 h-[70vh]">
								<iframe
									src={profile.resume ?? undefined}
									className="w-full h-full"
									title="Resume PDF"
								/>
							</div>
						</div>
					</div>
				)}

				{showEdit && (
					<div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
						<div className="bg-white w-11/12 max-w-4xl rounded-lg shadow-lg overflow-hidden">
							<div className="flex justify-between items-center p-4 border-b">
								<h3 className="text-xl font-semibold">Edit Profile</h3>
								<button
									onClick={() => setShowEdit(false)}
									className="text-lg text-gray-500 hover:text-red-500"
								>
									✕
								</button>
							</div>
							<div className="p-6">
								<ProfileEdit
									profile={{
										ucf_id: profile.ucf_id, 
										first_name: profile.first_name ?? undefined, 
										last_name: profile.last_name ?? undefined,
										email: profile.email,
										phone_number: profile.phone_number ?? undefined,
										major: profile.major ?? undefined,
										resume_url: profile.resume ?? undefined,
									}}
									onClose={() => {
										setShowEdit(false);
										refetchProfile();	// refresh profile after profile edit closes
									}}
								/>                     
							</div>
						</div>
					</div>
				)}

				{/* ORDER RECEIPTS */}
				<section className="w-1/2 flex flex-col gap-5 h-full">
					<div className="flex gap-5">
						{/* events attended TO BE IMPLEMENT LATER */}
						<div className="flex-1 p-5 bg-[var(--shpe-light-blue)] shadow-sm">
							<div className="bg-[#b3cad6] p-5 rounded shadow">
								<h3 className="font-bold text-2xl mb-2 tracking-[0.1em]">INCOMING!</h3>
								<p>New feature coming soon!!</p>
							</div>
						</div>
						{/* total spent */}
						<div className="flex-1 p-5 bg-[var(--shpe-light-blue)] shadow-sm">
							<div className="bg-[#b3cad6] p-5 rounded shadow flex flex-col items-start">
								<h3 className="font-bold text-2xl mb-2 tracking-[0.1em]">PURCHASES</h3>

								<div className="w-full flex justify-center">
									<div className="w-42 h-42 rounded-full bg-[var(--shpe-yellow)] flex items-center justify-center shadow-inner">
										<p className="text-4xl font-bold">${totalSpent.toFixed(2)}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="p-5 bg-[var(--shpe-light-blue)] shadow-sm">
						<div className="bg-[#b3cad6] p-5 rounded shadow">
							<h2 className="text-2xl font-bold mb-2 font-helios tracking-[0.1em]">ORDER RECEIPTS</h2>
							<div className="max-h-[150px] overflow-y-auto pr-2 space-y-3 text-sm">
								{orders && orders.length > 0 ? (
									<ul className="space-y-3 text-sm">
										{orders.map((order, i) => (
											<li key={i} className="bg-white rounded shadow p-4 text-black">
												<p><strong>Order ID:</strong> {order.id}</p>
												{order.createdAt && <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>}

												{Array.isArray(order.lineItems) && order.lineItems?.length > 0 && (
													<div className="mt-2">
														<p className="font-semibold">Items:</p>
														<ul className="pl-4 space-y-1 text-sm">
															{order.lineItems?.map((item, idx) => (
																<li key={idx} className="flex justify-between">
																	<div>
																		<p>{item.name}</p>
																		<p className="text-gray-500 text-xs">
																			{item.quantity} x ${(Number(item.basePriceMoney?.amount ?? 0) / 100).toFixed(2)}
																		</p>
																	</div>
																	<p>${(Number(item.totalMoney?.amount ?? 0) / 100).toFixed(2)}</p>
																</li>
															))}
														</ul>
													</div>
												)}
												
												{order.taxes?.length ? (
													<div className="mb-2">
														<p className="text-gray-700 font-semibold">Taxes:</p>
														<ul className="text-sm text-gray-600">
															{order.taxes.map((tax, idx) => (
																<li key={idx}>
																	{tax.name ?? "Tax"}: {tax.percentage ?? "N/A"}%
																</li>
															))}
														</ul>
														<p className="mt-1 text-sm">
															<strong>Total Taxes Applied:</strong> ${((order.taxes ?? []).reduce((sum, tax) => sum + Number(tax.appliedMoney?.amount ?? 0), 0) / 100).toFixed(2)}
														</p>
													</div>
												) : null}

												<div className="mb-2">											
													<p className="text-sm">
														<strong>Total:</strong> ${(Number(order.totalMoney?.amount ?? 0) / 100).toFixed(2)}
													</p>
												</div>

												{order.tenders.length > 0 && ( 										
													<div className="mt-2 text-sm">
														<strong>Method(s):</strong>
														<ul>
															{order.tenders.map((tender, index) => (
																<li key={index}>
																	{tender.type} - Payment ID: {tender.paymentId ?? "N/A"}
																</li>
															))}
														</ul>
													</div>
												)}
											</li>
										))}
									</ul>
								) : (
									<p>No payment orders found for this member.</p>
								)}
							</div>
							<div className="flex justify-center gap-4 mt-4">
								<button
									onClick={handlePrevPage}
									disabled={cursorIndex === 0}
									className="px-4 py-1 bg-blue-600 text-white rounded disabled:bg-gray-400"
								>
									← Prev
								</button>
								<p className="text-sm mt-2 text-gray-700">Page {page}</p>
								<button
									onClick={handleNextPage}
									disabled={!hasNextPage}
									className="px-4 py-1 bg-blue-600 text-white rounded disabled:bg-gray-400"
								>
									Next →
								</button>						
							</div>
						</div>
						<div className="mt-4">
							<button
								onClick={() => {
									if (!profile?.square_customer_id) {
										console.error("Missing customer ID");
										return;
									}
									createTestOrder({customerId: profile.square_customer_id})
								}}
								disabled={creatingTestOrder || !profile?.square_customer_id}
								className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
							>
								{creatingTestOrder ? "Creating Test Order..." : "Create Test Customer + Order"}
							</button>

							{createdData && (
								<div className="mt-2 text-sm text-black">
								<p><strong>Test Customer ID:</strong> {createdData.customerId}</p>
								<p><strong>Test Order ID:</strong> {createdData.orderId}</p>
								</div>
							)}
						</div>
					</div>
				</section>
			</div>
		</main>
	)
}