const table = "tasks"

// Need mo pa iconfigure supabase dito
// CREATE POLICY "Allow public read-only access" 
// ON public.tasks 
// FOR SELECT 
// TO anon 
// USING (true);
export const getTasks = async (supabaseInstance, stateFunction) => {
    const supabase = supabaseInstance
    const { data, error } = await supabase.from(table).select().order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    stateFunction(data);
}

export const getTask = async (taskID, supabaseInstance) => {
    if(!taskID || !supabaseInstance) {
        console.error('Task ID and/or Supabase instance is missing.')
        return
    }
    const supabase = supabaseInstance
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
export const addTask = async (taskData, supabaseInstance) => {
    const supabase = supabaseInstance
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
export const updateTask = async (taskID, taskData, supabaseInstance) => {
    console.log(taskData)
    const supabase = supabaseInstance
    const { data, error } = await supabase.from(table).update(taskData).eq('id', taskID).select()

    if (error) {
        console.error(error);
        return;
    }

    return data
}

export const getTasksDescriptionOnly = async (supabaseInstance, stateFunction) => {
    const supabase = supabaseInstance

    const { data, error } = await supabase.from(table).select('description').throwOnError()

    stateFunction(data);
}

// create policy "public can delete data"
// on tasks
// for delete
// to anon
// using ( true );
export const deleteTask = async (taskID, supabaseInstance) => {
    if(!taskID || !supabaseInstance) {
        console.error('Task ID and/or Supabase instance is missing.')
        return
    }
    const supabase = supabaseInstance
    const { data, error } = await supabase.from(table).delete().eq("id", taskID).select().throwOnError();

    if (error) {
        console.error(error);
        return;
    }

    return data
}

export const searchTask = async (taskName, supabaseInstance) => {
    if(!supabaseInstance) {
        console.error('Supabase instance is missing.')
        return
    }

    const supabase = supabaseInstance
    const { data, error } = await supabase.from(table).select().ilike('name', `%${taskName}%`)

    if (error) {
        console.error(error);
        return;
    }

    console.log(data)
    return data
}