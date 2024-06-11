import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import styled from 'styled-components';

const StyledSlider = styled(Slider.Root)`
  display: flex;
  align-items: center;
  width: 100%;
  height: 20px;
`;

const StyledTrack = styled(Slider.Track)`
  background-color: #e5e5e5;
  position: relative;
  flex-grow: 1;
  border-radius: 9999px;
  height: 8px;
`;

const StyledRange = styled(Slider.Range)`
  position: absolute;
  background-color: #000;
  border-radius: 9999px;
  height: 100%;
`;

const StyledThumb = styled(Slider.Thumb)`
  display: block;
  width: 16px;
  height: 16px;
  background-color: #fff;
  border: 2px solid #999;
  border-radius: 50%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: #fff;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.2);
  }
`;

const ValueDisplay = styled.div`
  margin-left: 10px;
  display: flex;
  align-items: center;
  font-size: 14px;
`;

const Slider = () => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <StyledSlider defaultValue={[50]} max={100} step={1}>
            <StyledTrack>
                <StyledRange />
            </StyledTrack>
            <StyledThumb />
        </StyledSlider>
        <ValueDisplay>
            <div style={{ width: '10px', height: '10px', backgroundColor: '#000', borderRadius: '50%', marginRight: '5px' }}></div>
            <span>2 Images</span>
        </ValueDisplay>
    </div>
);

export default Slider;
