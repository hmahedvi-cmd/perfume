function CategoryFilter({

category,

setCategory

}){

return(

<select

value={category}

onChange={(e)=>

setCategory(e.target.value)

}

>

<option>All</option>

<option>Men</option>

<option>Women</option>

</select>

)

}

export default CategoryFilter;