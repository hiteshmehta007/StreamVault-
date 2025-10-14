import React, { useState } from 'react';
import { Plus, Trash2, Clock, Video, Calendar as CalendarIcon, X, Save } from 'lucide-react';
import styles from './ScheduleCalendar.module.css';

// Event types
type EventType = 'video' | 'stream' | 'meeting' | 'reminder';

interface ScheduledEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  type: EventType;
  description?: string;
  duration?: number; // in minutes
  color?: string;
}

// Example scheduled events data
const initialScheduledEvents: ScheduledEvent[] = [
  { id: 1, title: 'React Basics', date: '2025-10-04', time: '14:00', type: 'video', duration: 60, color: '#3b82f6' },
  { id: 2, title: 'Advanced JS', date: '2025-10-06', time: '16:30', type: 'video', duration: 90, color: '#3b82f6' },
  { id: 3, title: 'UI/UX Tips', date: '2025-10-06', time: '10:00', type: 'stream', duration: 120, color: '#ef4444' },
  { id: 4, title: 'Team Meeting', date: '2025-10-08', time: '15:00', type: 'meeting', duration: 30, color: '#10b981' },
];

const eventTypeConfig = {
  video: { icon: Video, color: '#3b82f6', label: 'Video Upload' },
  stream: { icon: Video, color: '#ef4444', label: 'Live Stream' },
  meeting: { icon: CalendarIcon, color: '#10b981', label: 'Meeting' },
  reminder: { icon: Clock, color: '#f59e0b', label: 'Reminder' }
};

function getMonthDays(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatTime(time: string) {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export const ScheduleCalendar: React.FC = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [scheduledEvents, setScheduledEvents] = useState<ScheduledEvent[]>(initialScheduledEvents);
  const [selectedEvent, setSelectedEvent] = useState<ScheduledEvent | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState<ScheduledEvent | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string>('');
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    type: 'video' as EventType,
    description: '',
    duration: 60
  });



  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      type: 'video',
      description: '',
      duration: 60
    });
    setIsAddingEvent(false);
    setSelectedEvent(null);
  };

  // Add new event
  const handleAddEvent = () => {
    if (!formData.title || !formData.date || !formData.time) return;
    
    const newEvent: ScheduledEvent = {
      id: Date.now(),
      ...formData,
      color: eventTypeConfig[formData.type].color
    };
    
    setScheduledEvents(prev => [...prev, newEvent]);
    resetForm();
  };

  // Update event
  const handleUpdateEvent = () => {
    if (!selectedEvent || !formData.title || !formData.date || !formData.time) return;
    
    setScheduledEvents(prev => 
      prev.map(event => 
        event.id === selectedEvent.id 
          ? { ...event, ...formData, color: eventTypeConfig[formData.type].color }
          : event
      )
    );
    resetForm();
  };

  // Delete event
  const handleDeleteEvent = (eventId: number) => {
    setScheduledEvents(prev => prev.filter(event => event.id !== eventId));
    resetForm();
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    const dateStr = formatDate(date);
    setFormData(prev => ({ ...prev, date: dateStr }));
    setIsAddingEvent(true);
  };

  // Handle event click
  const handleEventClick = (event: ScheduledEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      type: event.type,
      description: event.description || '',
      duration: event.duration || 60
    });
    setIsAddingEvent(true);
  };

  // Drag and drop handlers
  const handleDragStart = (event: ScheduledEvent, e: React.DragEvent) => {
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (date: Date, e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedEvent) return;
    
    const newDate = formatDate(date);
    setScheduledEvents(prev => 
      prev.map(event => 
        event.id === draggedEvent.id 
          ? { ...event, date: newDate }
          : event
      )
    );
    setDraggedEvent(null);
    setHoveredDate('');
  };

  const handleDragEnter = (date: Date) => {
    setHoveredDate(formatDate(date));
  };

  const handleDragLeave = () => {
    setHoveredDate('');
  };

  const daysInMonth = getMonthDays(currentYear, currentMonth);
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  // Build calendar grid
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(new Date(currentYear, currentMonth, d));
  }
  while (calendarDays.length < 42) { // 6 weeks
    calendarDays.push(null);
  }

  const todayDateStr = formatDate(today);

  // Navigation handlers
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  return (
    <div className={styles.calendarContainer}>
      {/* Header with navigation and actions */}
      <div className={styles.calendarHeader}>
        <div className={styles.headerTop}>
          <div className={styles.monthNavigation}>
            <button
              className={styles.navButton}
              onClick={goToPreviousMonth}
              aria-label="Previous Month"
            >
              ←
            </button>
            <h2 className={styles.monthTitle}>
              {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
            </h2>
            <button
              className={styles.navButton}
              onClick={goToNextMonth}
              aria-label="Next Month"
            >
              →
            </button>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.todayButton}
              onClick={goToToday}
            >
              Today
            </button>
            <button
              className={styles.addEventButton}
              onClick={() => {
                setFormData(prev => ({ ...prev, date: todayDateStr }));
                setIsAddingEvent(true);
              }}
              title="Add new event"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Event
            </button>
          </div>
        </div>
      </div>

      {/* Event type legend */}
      <div className={styles.eventLegend}>
        {Object.entries(eventTypeConfig).map(([type, config]) => {
          const Icon = config.icon;
          return (
            <div key={type} className={styles.legendItem}>
              <div 
                className={`${styles.legendColor} ${styles[`legendColor${type.charAt(0).toUpperCase()}${type.slice(1)}`]}`}
              />
              <Icon className="h-3 w-3" />
              <span>{config.label}</span>
            </div>
          );
        })}
      </div>

      {/* Days of week header */}
      <div className={styles.daysRow}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className={styles.dayHeader}>{day}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className={styles.calendarGrid}>
        {calendarDays.map((date, idx) => {
          if (!date) {
            return <div key={idx} className={styles.emptyCell} />;
          }

          const dateStr = formatDate(date);
          const isToday = dateStr === todayDateStr;
          const eventsForDate = scheduledEvents.filter(event => event.date === dateStr);
          const isHovered = hoveredDate === dateStr;
          const isPastDate = date < today && !isToday;

          return (
            <div
              key={idx}
              className={`
                ${styles.calendarCell} 
                ${isToday ? styles.todayCell : ''}
                ${isPastDate ? styles.pastCell : ''}
                ${isHovered ? styles.hoveredCell : ''}
              `}
              onClick={() => !isPastDate && handleDateClick(date)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(date, e)}
              onDragEnter={() => handleDragEnter(date)}
              onDragLeave={handleDragLeave}
            >
              {/* Date number */}
              <div className={`${styles.dateNumber} ${isToday ? styles.todayNumber : ''}`}>
                {date.getDate()}
              </div>

              {/* Add event button */}
              {!isPastDate && (
                <button
                  className={styles.quickAddButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDateClick(date);
                  }}
                  title="Add event"
                >
                  <Plus className="h-3 w-3" />
                </button>
              )}

              {/* Events */}
              <div className={styles.eventsContainer}>
                {eventsForDate.slice(0, 3).map(event => {
                  const EventIcon = eventTypeConfig[event.type].icon;
                  return (
                    <div
                      key={event.id}
                      className={`${styles.event} ${styles[`event${event.type.charAt(0).toUpperCase()}${event.type.slice(1)}`]}`}
                      data-event-type={event.type}
                      draggable
                      onDragStart={(e) => handleDragStart(event, e)}
                      onClick={(e) => handleEventClick(event, e)}
                      title={`${event.title} at ${formatTime(event.time)}${event.duration ? ` (${event.duration}min)` : ''}`}
                    >
                      <div className={styles.eventHeader}>
                        <EventIcon className="h-3 w-3" />
                        <span className={styles.eventTime}>{formatTime(event.time)}</span>
                      </div>
                      <div className={styles.eventTitle}>{event.title}</div>
                      {event.duration && (
                        <div className={styles.eventDuration}>{event.duration}min</div>
                      )}
                    </div>
                  );
                })}
                
                {/* Show more indicator */}
                {eventsForDate.length > 3 && (
                  <div className={styles.moreEvents}>
                    +{eventsForDate.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Event form modal */}
      {isAddingEvent && (
        <div className={styles.modalOverlay} onClick={() => !selectedEvent && resetForm()}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {selectedEvent ? 'Edit Event' : 'Add New Event'}
              </h3>
              <button
                className={styles.closeButton}
                onClick={resetForm}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className={styles.modalContent}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Event Title</label>
                <input
                  type="text"
                  className={styles.formInput}
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter event title"
                  title="Event title"
                  aria-label="Event title"
                  autoFocus
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Date</label>
                  <input
                    type="date"
                    className={styles.formInput}
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    title="Event date"
                    aria-label="Event date"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Time</label>
                  <input
                    type="time"
                    className={styles.formInput}
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    title="Event time"
                    aria-label="Event time"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Event Type</label>
                  <select
                    className={styles.formSelect}
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as EventType }))}
                    title="Event type"
                    aria-label="Event type"
                  >
                    {Object.entries(eventTypeConfig).map(([type, config]) => (
                      <option key={type} value={type}>{config.label}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Duration (minutes)</label>
                  <input
                    type="number"
                    className={styles.formInput}
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    min="15"
                    step="15"
                    title="Event duration in minutes"
                    aria-label="Event duration in minutes"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description (optional)</label>
                <textarea
                  className={styles.formTextarea}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Add notes or description"
                  rows={3}
                />
              </div>
            </div>

            <div className={styles.modalActions}>
              {selectedEvent && (
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              )}
              <div className={styles.modalActionsRight}>
                <button
                  className={styles.cancelButton}
                  onClick={resetForm}
                >
                  Cancel
                </button>
                <button
                  className={styles.saveButton}
                  onClick={selectedEvent ? handleUpdateEvent : handleAddEvent}
                  disabled={!formData.title || !formData.date || !formData.time}
                >
                  <Save className="h-4 w-4 mr-1" />
                  {selectedEvent ? 'Update' : 'Add'} Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
