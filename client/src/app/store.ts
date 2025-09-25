import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice.ts'
import departmentReducer from './slices/departmentSlice.ts'
import studentReducer from './slices/studentSlice.ts'
import teacherReducer from './slices/teacherSlice.ts'
import hodReducer from './slices/hodSlice.ts'
import userReducer from './slices/userSlice.ts'
import courseReducer from './slices/courseSlice.ts'
import enrollmentReducer from './slices/enrollmentSlice.ts'

const store = configureStore({
    reducer: {
        auth: authReducer,
        department: departmentReducer,
        course: courseReducer,
        enrollment: enrollmentReducer,
        user: userReducer,
        student: studentReducer,
        teacher: teacherReducer,
        hod: hodReducer,
    }
})

// Infer the `RootState` type from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: { auth: AuthState }
export type AppDispatch = typeof store.dispatch

export default store