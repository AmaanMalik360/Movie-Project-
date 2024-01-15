const initialState = {
    blogs: [],
    blog: {},
    isLoading: false,
    error: null,
  };
  
export default (state = initialState, action) => 
{
    switch (action.type) 
    {
        case "MOVIES_DATA_REQUEST":
        state = {
            ...state,
            isLoading: true
        };
        break;

        case "MOVIES_DATA_SUCCESS":
        state = {
            ...state,
            blogs: action.payload.blogs,
            isLoading: false
        };
        break;

        case "MOVIES_DATA_FAILURE":
        state = {
            ...state,
            isLoading: false,
            error: action.payload.error,
        };
        break;

        //   case "SINGLE_BLOG_DATA_REQUEST":
        //     state = {
        //       ...state,
        //       isLoading: true
        //     };
        //   break;

        //   case "SINGLE_BLOG_DATA_SUCCESS":
        //     state = {
        //       ...state,
        //       blog: action.payload,
        //       isLoading: false
        //     };
        //   break;

        //   case "SINGLE_BLOG_DATA_FAILURE":
        //     state = {
        //       ...state,
        //       isLoading: false,
        //       error: action.payload,
        //     };
        //   break;

        //   case "DELETE_BLOG_DATA":
        //     state = {
        //       ...state,
        //       blogs: state.blogs.filter((blog) => blog.id !== action.payload),
        //     };
        //   break;
    
        //   case "CREATE_BLOG_DATA":
        //     state = {
        //       ...state,
        //       blogs: [...state.blogs, action.payload],
        //     };
        //   break;

        //   case "UPDATE_BLOG_DATA":
        //     state = {
        //       ...state,
        //       blogs: state.blogs.map((blog) =>
        //         blog.id === action.payload.id ? action.payload : blog
        //       ),
        //     };
        //   break;
        // default:
        //     return initialState;
  
    }
return state;
};