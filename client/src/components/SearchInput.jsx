import { TextField } from "@mui/material"
import { useNavigate, useLocation } from "react-router-dom"

const SearchInput = () => {
  const height = 19.5;
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div>
      <form onSubmit={(event) => {
        event.preventDefault()
        const search = event.target.search.value
        if (!search) return;
        navigate(`/search/${search}`)
        if (location.pathname.includes("/search/")) {
          navigate(0)
        }
        
      }}>
        <TextField 
          id="search"
          name="search"
          type="text"
          label="Procurar..."
          variant="outlined"
          fullWidth
          inputProps={{
            style: {
              height
            }
          }}
          InputLabelProps={{
            style: {
              height
            }
          }}
          size="small"
        />
      </form>
    </div>
  )
}

export default SearchInput