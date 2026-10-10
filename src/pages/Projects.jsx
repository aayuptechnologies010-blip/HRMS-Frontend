import { useState, useEffect } from 'react';
import { MdAdd, MdMoreHoriz, MdMessage, MdAttachFile, MdAccessTime, MdErrorOutline } from 'react-icons/md';
import api from '../services/api';

export default function Projects() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects/tasks');
      setTasks(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      // Optimistic UI update
      setTasks(prevTasks => prevTasks.map(t => 
        t._id === taskId ? { ...t, status: newStatus } : t
      ));

      await api.patch(`/projects/tasks/${taskId}/status`, { status: newStatus });
    } catch (err) {
      console.error('Failed to update task status:', err);
      fetchTasks(); // Revert on failure
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) {
      updateTaskStatus(taskId, newStatus);
    }
  };

  const columns = ['Assigned', 'In Progress', 'In Review', 'Completed'];

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">Projects & Tasks</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">Manage project workflows and track daily work</p>
        </div>
        <button className="bg-[var(--color-brand-blue)] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:bg-[var(--color-brand-dark)] transition-colors flex items-center">
          <MdAdd size={20} className="mr-2" />
          Create Task
        </button>
      </div>

      {error && (
        <div className="bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] text-[var(--color-danger)] p-4 rounded-xl flex items-center shrink-0">
          <MdErrorOutline size={20} className="mr-2" />
          {error}
        </div>
      )}

      {/* Kanban Board View */}
      <div className="flex gap-6 overflow-x-auto pb-4 flex-1">
        {loading ? (
          <div className="w-full flex justify-center pt-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-brand-blue)]"></div>
          </div>
        ) : (
          columns.map(columnStatus => (
            <div 
              key={columnStatus}
              className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] shadow-sm min-w-[320px] w-[320px] flex flex-col"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, columnStatus)}
            >
              <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center shrink-0">
                <h3 className="font-bold text-[var(--color-text-primary)]">{columnStatus}</h3>
                <span className="bg-[var(--color-background)] text-[var(--color-text-muted)] text-xs font-bold px-2 py-1 rounded-lg">
                  {tasks.filter(t => t.status === columnStatus || (columnStatus === 'Assigned' && !columns.includes(t.status))).length}
                </span>
              </div>
              
              <div className="p-4 flex-1 overflow-y-auto space-y-3">
                {tasks
                  .filter(task => task.status === columnStatus || (columnStatus === 'Assigned' && !columns.includes(task.status)))
                  .map(task => (
                    <div 
                      key={task._id} 
                      className="bg-[var(--color-background)] border border-[var(--color-border)] p-4 rounded-xl shadow-sm cursor-grab active:cursor-grabbing hover:border-[var(--color-brand-blue)] hover:shadow-md transition-all group"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide
                          ${task.priority === 'High' ? 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]' : 
                            task.priority === 'Medium' ? 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]' : 
                            'bg-[var(--color-info-bg)] text-[var(--color-info)]'}
                        `}>
                          {task.priority || 'Normal'}
                        </span>
                        <MdMoreHoriz className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] cursor-pointer" />
                      </div>
                      <h4 className="font-bold text-[var(--color-text-primary)] text-sm mb-1">{task.title}</h4>
                      <p className="text-xs text-[var(--color-text-muted)] line-clamp-2 mb-4">{task.projectId?.name}</p>
                      
                      <div className="flex justify-between items-center mt-auto pt-3 border-t border-[var(--color-border)]">
                        <div className="flex items-center text-xs text-[var(--color-text-muted)]">
                          <MdAccessTime size={14} className="mr-1" />
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-'}
                        </div>
                        {task.assigneeId && (
                          <div className="w-6 h-6 rounded-full bg-[var(--color-brand-light)] text-[var(--color-brand-blue)] flex items-center justify-center text-xs font-bold" title={`${task.assigneeId.firstName} ${task.assigneeId.lastName}`}>
                            {task.assigneeId.firstName.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
