
const members = [
  {
    name: "Santiago",
    role: "Director",
    major: "Art",
    future_ind: "Samsung",
    bio: "Aguante la falopa",
    hobbies: "Fulbo",
    country: "Uruguay",
    linkedin: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    picture: "LuchoSuarez.svg"

  }
]

export default function TeamSection() {
  return(
    <main>
      <div className = "flex item-center">

        {members.map(({ name, role, major}) => (
          <image src = "$">

          </image>

          <button>

          </button>
        ))}

        <div>

        </div>
        
      </div>
    </main>
  )
}