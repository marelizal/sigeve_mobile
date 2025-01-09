import { Roadmap } from '@/models/roadmap';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface RoadmapState {
  roadmaps: Roadmap[];
  activeRoadmap: Roadmap | null;
}

const initialState: RoadmapState = {
  roadmaps: [],
  activeRoadmap: null,
};

const roadmapSlice = createSlice({
  name: 'roadmap',
  initialState,
  reducers: {
    setRoadmaps: (state, action: PayloadAction<Roadmap[]>) => {
      state.roadmaps = action.payload;
    },
    setActiveRoadmap: (state, action: PayloadAction<Roadmap | null>) => {
      state.activeRoadmap = action.payload;
    },
    updateDestination: (state, action: PayloadAction<{ roadmapId: string, destinationId: string, visited: boolean }>) => {
      const roadmap = state.roadmaps.find(r => r.id === action.payload.roadmapId);
      if (roadmap) {
        const destination = roadmap.destinations.find(d => d._id === action.payload.destinationId);
        if (destination) {
          destination.visited = action.payload.visited;
        }
      }
      if (state.activeRoadmap && state.activeRoadmap.id === action.payload.roadmapId) {
        const destination = state.activeRoadmap.destinations.find(d => d._id === action.payload.destinationId);
        if (destination) {
          destination.visited = action.payload.visited;
        }
      }
    },
    finishRoadmap: (state, action: PayloadAction<{ roadmapId: string, observations: string }>) => {
      const roadmap = state.roadmaps.find(r => r.id === action.payload.roadmapId);
      if (roadmap) {
        roadmap.status = 'finished';
        roadmap.observations = action.payload.observations;
      }
      if (state.activeRoadmap && state.activeRoadmap.id === action.payload.roadmapId) {
        state.activeRoadmap = null;
      }
    },
  },
});

export const { setRoadmaps, setActiveRoadmap, updateDestination, finishRoadmap } = roadmapSlice.actions;
export default roadmapSlice.reducer;
