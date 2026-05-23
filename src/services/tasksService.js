const table = "tasks"
import { supabase } from '../services/supabase'

// Need mo pa iconfigure supabase dito
// CREATE POLICY "Allow public read-only access" 
// ON public.tasks 
// FOR SELECT 
// TO anon 
// USING (true);
export const getTasks = async (stateFunction) => {
    
    const { data, error } = await supabase.from(table).select().order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    stateFunction(data);
}

export const getTask = async (taskID) => {
    if(!taskID) {
        console.error('Task ID is missing.')
        return
    }
    
    const { data, error } = await supabase.from(table).select().eq("id", taskID).limit(1).single()

    if (error) {
        console.error(error);
        return;
    }

    return data
}

// Need mo pa iconfigure supabase dito RLS
// CREATE POLICY "Allow public inserts"
// ON public.tasks
// FOR INSERT
// TO anon
// WITH CHECK (true);
export const addTask = async (taskData) => {
    
    const { data, error } = await supabase.from(table).insert(taskData).select().throwOnError();

    if (error) {
        console.error(error);
        return;
    }

    return data
}

// Need mo pa iconfigure supabase dito
// CREATE POLICY "Allow public update" 
// ON public.tasks 
// FOR UPDATE 
// TO anon 
// USING (true)
// WITH CHECK (true);
export const updateTask = async (taskID, taskData) => {
    console.log(taskData)
    
    const { data, error } = await supabase.from(table).update(taskData).eq('id', taskID).select()

    if (error) {
        console.error(error);
        return;
    }

    return data
}

export const getTasksDescriptionOnly = async (stateFunction) => {
    

    const { data, error } = await supabase.from(table).select('description').throwOnError()

    stateFunction(data);
}

// create policy "public can delete data"
// on tasks
// for delete
// to anon
// using ( true );
export const deleteTask = async (taskID) => {
    if(!taskID) {
        console.error('Task ID is missing.')
        return
    }
    
    const { data, error } = await supabase.from(table).delete().eq("id", taskID).select().throwOnError();

    if (error) {
        console.error(error);
        return;
    }

    return data
}

export const searchTask = async (taskName) => {
    const { data, error } = await supabase.from(table).select().ilike('name', `%${taskName}%`)

    if (error) {
        console.error(error);
        return;
    }

    console.log(data)
    return data
}








// AUTH
export const register = async (credentials) => { 
    const { data, error } = await supabase.auth.signUp(credentials)

    if (error) {
        console.error(error);
        return;
    }

    console.log(data)
    return data
}

export const login = async (credentials) => {

    const { data, error } = await supabase.auth.signInWithPassword(credentials)

    if (error) {
        console.error(error);
        return;
    }

    console.log(data)
    return data
}

export const logout = async () => {

    const { error } = await supabase.auth.signOut({ scope: 'local' })

    if (error) {
        console.error(error);
        return;
    }
}

export const getSession = async () => {

    const { data, error } = await supabase.auth.getSession()

    if (error) {
        console.error(error);
        return;
    }

    console.log(data)
    return data
}

export const getUser = async () => {

    const { data, error } = await supabase.auth.getUser()

    if (error) {
        console.error(error);
        return;
    }

    console.log(data)
    const { user } = data
    console.log(user)

    return user
}





// FILE
// simula dito ko dineclare yung const supabase sa taas
export const uploadImage = async (file) => {
    if(!file) return null

    const fileExtension = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`
    const filePath = `public/${fileName}`

    const { error } = await supabase.storage.from('task-images').upload(filePath, file)

    if(error) {
        console.error(`Upload error: ${error}`)
        throw error
    }

    const { data } = await supabase.storage.from('task-images').getPublicUrl(filePath)

    return data.publicUrl
}

export const deleteImage = async (filePath) => {
    if(!filePath) return null

    const folderName = "task-images/"
    const pathIndex = filePath.indexOf(folderName) + folderName.length
    const finalPath = filePath.substring(pathIndex)

    const { error } = await supabase.storage.from('task-images').remove([finalPath])

    if (error) {
        console.error(error);
        return;
    }
}