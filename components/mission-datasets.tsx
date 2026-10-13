'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  Check,
  Clock,
  Code2,
  Copy,
  Cpu,
  Database,
  ExternalLink,
  FolderTree,
  HardDrive,
  Layers,
  Share2,
  ShieldCheck,
  Terminal,
  Video,
  X,
} from 'lucide-react';
import { ALL_DATASETS, type ExtendedDatasetSpec } from '../src/data/datasets';
import { DatasetVideoPlayer } from '../src/components/DatasetVideoPlayer';

type Segment = {
  id: string;
  label: string;
  timestamp: string;
  timeSeconds: number;
  duration: string;
  phase: string;
  description: string;
};

type Dataset = {
  id?: string;
  code: string;
  title: string;
  category: string;
  environment: string;
  duration: string;
  resolution: string;
  fps: number;
  trajectoriesCount: number;
  subjectsCount: number;
  sensor: string;
  annotations: string;
  format: string;
  size: string;
  description: string;
  thumbnail: string;
  youtubeId: string;
  youtubeUrl: string;
  videoDuration: string;
  segments: Segment[];
  tasksCount?: number;
  status?: string;
  licenseType?: string;
  keySensors?: string[];
  activityLabel?: string;
  overlayLabel?: string;
  overlayColor?: string;
  videoSegments?: Segment[];
};

type DetailTab = 'directory' | 'modalities' | 'inspector';
type PayloadFile = 'tasks_action' | 'hand_trajectory' | 'stereo_calibration';

const sampleDatasets: Dataset[] = [
  {
    code: 'DS-SEW-01',
    title: 'Precision Clothes Sewing & Industrial Garment Seam Assembly',
    category: 'Manufacturing',
    environment: 'Professional Textile Studio & Garment Production Line',
    duration: '14.5 Hours',
    resolution: '3840x2160 (4K UHD)',
    fps: 60,
    trajectoriesCount: 2950,
    subjectsCount: 12,
    sensor: 'Head-Mounted Egocentric 4K Stereo Visor + Dual Wrist IMU',
    annotations: '3D Hand Pose, fabric tension vector, machine needle trajectory, seam alignment boundary',
    format: 'MP4 + Parquet + ROS2 / LeRobot',
    size: '1.4 TB full / 250 MB sample',
    description:
      'First-person capture of garment sewing: fabric handling, bimanual tension alignment, machine guidance, and hem finishing.',
    thumbnail: 'https://img.youtube.com/vi/8j_TPuW6FOc/maxresdefault.jpg',
    youtubeId: '8j_TPuW6FOc',
    youtubeUrl: 'https://youtu.be/8j_TPuW6FOc',
    videoDuration: '01:10',
    segments: [
      ['seg-1', 'Raw Fabric Intake & Clamp Alignment', '00:00', 0, '10.0s', 'Fabric Prep', 'Positioning raw cloth cutouts under presser foot and aligning guide margins.'],
      ['seg-2', 'Presser Foot Lowering & Needle Centering', '00:10', 10, '10.0s', 'Tool Engagement', 'Lowering presser foot bar and testing needle puncture clearance on seam allowance.'],
      ['seg-3', 'Initial Lockstitch & Bimanual Seam Feeding', '00:20', 20, '12.0s', 'Continuous Stitching', 'Engaging foot pedal, setting first anchoring stitches, and establishing bimanual feed rate.'],
      ['seg-4', 'Tension Regulated Straight Line Feed', '00:32', 32, '10.0s', 'Seam Guidance', 'Guiding fabric panel with steady left-hand lateral pull against mechanical needle oscillations.'],
      ['seg-5', 'Curved Margin Tracking & Hand Reorientation', '00:42', 42, '10.0s', 'Angular Contour', 'Pivoting cloth orientation around curved garment contour with micro finger repositioning.'],
      ['seg-6', 'Reverse Stitch Reinforcement', '00:52', 52, '10.0s', 'Seam Lock', 'Backstitching to lock the seam end securely.'],
      ['seg-7', 'Presser Foot Lift, Snip & QC Inspection', '01:02', 62, '8.0s', 'Completion & QC', 'Lifting the presser foot, clearing the finished hem, snipping threads, and inspecting stitch pitch.'],
    ].map(toSegment),
  },
  {
    code: 'DS-BAG-02',
    title: 'Custom Bag Screen Printing & Manual Squeegee Ink Transfer',
    category: 'Creative Crafts',
    environment: 'Custom Apparel Print Studio & Silk Screen Workshop',
    duration: '11.8 Hours',
    resolution: '3840x2160 (4K UHD)',
    fps: 60,
    trajectoriesCount: 2400,
    subjectsCount: 10,
    sensor: 'Head-Mounted Egocentric 4K Stereo Visor + Squeegee 6DoF IMU',
    annotations: 'Squeegee 6DoF vector, pressure profile, screen registration mesh, ink spread bounding box',
    format: 'MP4 + Parquet + ROS2 / LeRobot',
    size: '1.2 TB full / 210 MB sample',
    description:
      'Manual screen printing on canvas bags: registration, ink flood stroke, squeegee draw, and print inspection.',
    thumbnail: 'https://img.youtube.com/vi/xAyxdGrfeMo/maxresdefault.jpg',
    youtubeId: 'xAyxdGrfeMo',
    youtubeUrl: 'https://youtu.be/xAyxdGrfeMo',
    videoDuration: '01:00',
    segments: [
      ['seg-1', 'Canvas Tote Loading & Registration Alignment', '00:00', 0, '8.0s', 'Platen Setup', 'Loading the tote bag over the platen, aligning seams, and centering the print boundary.'],
      ['seg-2', 'Surface Wrinkle Smoothing & Platen Tack', '00:08', 8, '10.0s', 'Substrate Prep', 'Pressing fabric flat against the platen to remove fabric bubbles.'],
      ['seg-3', 'Stencil Screen Hinge Lowering & Clamp', '00:18', 18, '8.0s', 'Screen Positioning', 'Lowering the screen, verifying spacing, and locking side clamps.'],
      ['seg-4', 'Plastisol Ink Deposit & Flood Stroke', '00:26', 26, '12.0s', 'Ink Flooding', 'Scooping ink across the reservoir and executing a light forward flood coat.'],
      ['seg-5', 'Pressurized 45 Degree Squeegee Draw Transfer', '00:38', 38, '10.0s', 'Pressure Transfer', 'Firm bimanual downward pressure forces ink through the stencil mesh.'],
      ['seg-6', 'Screen Delamination & Vertical Hinge Lift', '00:48', 48, '7.0s', 'Screen Lift', 'Slow vertical peel to prevent ink smudging and edge feathering.'],
      ['seg-7', 'Print Opacity Inspection & Unload', '00:55', 55, '5.0s', 'Unload & QC', 'Evaluating edge crispness and peeling the finished bag off the platen.'],
    ].map(toSegment),
  },
  {
    code: 'DS-LATTE-03',
    title: 'Specialty Coffee Milk Steaming & Free-Pour Latte Art',
    category: 'Food & Beverage',
    environment: 'Specialty Coffee Espresso Bar & Barista Training Station',
    duration: '16.0 Hours',
    resolution: '3840x2160 (4K UHD)',
    fps: 60,
    trajectoriesCount: 3400,
    subjectsCount: 14,
    sensor: 'Head-Mounted Egocentric 4K Visor + Pitcher 6DoF Pose Tracker',
    annotations: 'Milk pitcher 6DoF pose, cup tilt angle, stream flow rate, surface foam contour',
    format: 'MP4 + Parquet + ROS2 / LeRobot',
    size: '1.5 TB full / 260 MB sample',
    description:
      'High-dexterity barista demonstration with pitcher motion, cup angle, liquid flow, and foam pattern formation.',
    thumbnail: 'https://img.youtube.com/vi/i9g25YPPqKA/maxresdefault.jpg',
    youtubeId: 'i9g25YPPqKA',
    youtubeUrl: 'https://youtu.be/i9g25YPPqKA',
    videoDuration: '00:59',
    segments: [
      ['seg-1', 'Espresso Shot Crema Inspection & Cup Grip', '00:00', 0, '10.0s', 'Base Angle Setup', 'Inspecting crema elasticity and grasping the cup with wrist tilt.'],
      ['seg-2', 'Steamed Milk Swirl & Glossy Vortex Aeration', '00:10', 10, '10.0s', 'Aeration Prep', 'Tapping and swirling the pitcher to homogenize liquid-to-foam ratio.'],
      ['seg-3', 'High-Elevation Pour for Crema Depth Blend', '00:20', 20, '10.0s', 'Liquid Integration', 'Thin milk stream from elevation dives under the crema surface.'],
      ['seg-4', 'Pitcher Spout Drop to Liquid Surface', '00:30', 30, '10.0s', 'Surface Approach', 'Dropping the pitcher tip close to the liquid surface while leveling the cup angle.'],
      ['seg-5', 'Rapid Wrist Oscillation & Rosetta Wave Spread', '00:40', 40, '10.0s', 'Rosetta Pour', 'Side-to-side wrist motion floats white foam ribbons across the surface.'],
      ['seg-6', 'Stream Thinning & Forward Draw-Through', '00:50', 50, '9.0s', 'Draw-Through & Finish', 'Elevating the spout and drawing forward through the pattern center.'],
    ].map(toSegment),
  },
  {
    code: 'DS-IRON-04',
    title: 'Precision Garment Steam Ironing & Fabric Wrinkle Flattening',
    category: 'Cleaning & Sanitation',
    environment: 'Commercial Laundry Facility & Professional Valet Suite',
    duration: '12.6 Hours',
    resolution: '3840x2160 (4K UHD)',
    fps: 60,
    trajectoriesCount: 2700,
    subjectsCount: 11,
    sensor: 'Head-Mounted Egocentric 4K Visor + Steam Iron Soleplate 6DoF Sensor',
    annotations: 'Iron soleplate trajectory, wrinkle deformation mask, fabric tension vector, thermal gradient',
    format: 'MP4 + Parquet + ROS2 / LeRobot',
    size: '1.3 TB full / 220 MB sample',
    description:
      'Garment care capture covering panel spread, hand stabilization, directional steam glide, and crease checks.',
    thumbnail: 'https://img.youtube.com/vi/JAVm2dwQWd0/maxresdefault.jpg',
    youtubeId: 'JAVm2dwQWd0',
    youtubeUrl: 'https://youtu.be/JAVm2dwQWd0',
    videoDuration: '01:10',
    segments: [
      ['seg-1', 'Garment Unfold & Ironing Board Spread', '00:00', 0, '10.0s', 'Board Staging', 'Laying the shirt panel flat, smoothing large folds, and grasping the hem edge.'],
      ['seg-2', 'Fabric Tension Stretch & Collar Flattening', '00:10', 10, '10.0s', 'Pre-Tensioning', 'Tensioning seams while flattening collar points along the board contour.'],
      ['seg-3', 'High-Pressure Steam Burst & Forward Glide', '00:20', 20, '12.0s', 'Body Pressing', 'Triggering steam while executing a long forward glide along the torso panel.'],
      ['seg-4', 'Shoulder Yoke Alignment & Contour Ironing', '00:32', 32, '12.0s', 'Shoulder Contour', 'Sliding rounded shoulder seams over the board tip and pressing curved seams.'],
      ['seg-5', 'Sleeve Crease Guidance & Cuff Detailing', '00:44', 44, '10.0s', 'Sleeve Finishing', 'Forming a crisp sleeve crease and pressing around the cuff.'],
      ['seg-6', 'Button Placket Precision Maneuver', '00:54', 54, '10.0s', 'Placket Detail', 'Navigating the soleplate apex between buttons without thermal contact.'],
      ['seg-7', 'Final Garment Reposition & Crease Check', '01:04', 64, '6.0s', 'Quality Inspection', 'Moving the shirt to a hanger and inspecting wrinkle elimination.'],
    ].map(toSegment),
  },
  {
    code: 'DS-GRASS-05',
    title: 'Lawn Trimming, Grass Boundary Cutting & Groundskeeping',
    category: 'Agriculture & Livestock',
    environment: 'Outdoor Grounds, Residential Turf & Garden Landscape',
    duration: '10.2 Hours',
    resolution: '3840x2160 (4K UHD)',
    fps: 60,
    trajectoriesCount: 2200,
    subjectsCount: 9,
    sensor: 'Outdoor Egocentric 4K Visor + Trimmer Shaft Dual IMU',
    annotations: 'Trimmer shaft pose, cutting plane normal, grass height mesh, obstacle bounding boxes',
    format: 'MP4 + Parquet + ROS2 / LeRobot',
    size: '1.1 TB full / 190 MB sample',
    description:
      'Outdoor groundskeeping capture with trimmer balance, sweeping passes, obstacle boundaries, and edge finishing.',
    thumbnail: 'https://img.youtube.com/vi/RD7tE22-H0Y/maxresdefault.jpg',
    youtubeId: 'RD7tE22-H0Y',
    youtubeUrl: 'https://youtu.be/RD7tE22-H0Y',
    videoDuration: '01:05',
    segments: [
      ['seg-1', 'Two-Handed Trimmer Stance & Ground Clearance', '00:00', 0, '8.0s', 'Stance Calibration', 'Establishing stance, checking line feed length, and holding the head above turf.'],
      ['seg-2', 'Throttle Trigger Engagement & RPM Stabilization', '00:08', 8, '10.0s', 'Motor Spin-Up', 'Squeezing the throttle trigger to bring the spool to cutting speed.'],
      ['seg-3', 'Wide Horizontal Sweeping Arc Across Turf', '00:18', 18, '12.0s', 'Primary Lawn Sweep', 'Executing a smooth pendular cutting pass across overgrown turf.'],
      ['seg-4', 'Obstacle Perimeter Weeding & Fence Clean', '00:30', 30, '12.0s', 'Obstacle Trimming', 'Trimming close around fence posts and landscaping boundaries.'],
      ['seg-5', '90 Degree Shaft Tilt for Sidewalk Edging', '00:42', 42, '10.0s', 'Curb Edging', 'Inverting the shaft to cut a trench boundary along concrete.'],
      ['seg-6', 'Grass Clump Dispersal & High-Speed Pass', '00:52', 52, '8.0s', 'Surface Leveling', 'Quick sweeping bursts clear cut mulch from the walkway surface.'],
      ['seg-7', 'Throttle Release, Brake & Boundary Check', '01:00', 60, '5.0s', 'Shutdown & QC', 'Releasing throttle, setting down the tool, and verifying the lawn edge.'],
    ].map(toSegment),
  },
  {
    code: 'DS-NAAN-06',
    title: 'Traditional Naan Bread Baking & High-Heat Stovetop Griddling',
    category: 'Food & Beverage',
    environment: 'Artisan Culinary Kitchen & High-Temperature Hearth Station',
    duration: '15.2 Hours',
    resolution: '3840x2160 (4K UHD)',
    fps: 60,
    trajectoriesCount: 3100,
    subjectsCount: 13,
    sensor: 'Head-Mounted Egocentric 4K Stereo Visor + Thermal IR Griddle Sensor',
    annotations: 'Dough contact mesh, griddle contact area, blister expansion rate, spatula flip vector',
    format: 'MP4 + Parquet + ROS2 / LeRobot',
    size: '1.45 TB full / 240 MB sample',
    description:
      'Culinary demonstration of dough shaping, griddle placement, blister monitoring, flipping, and finish handling.',
    thumbnail: 'https://img.youtube.com/vi/VhMsIlIY6mc/maxresdefault.jpg',
    youtubeId: 'VhMsIlIY6mc',
    youtubeUrl: 'https://youtu.be/VhMsIlIY6mc',
    videoDuration: '00:55',
    segments: [
      ['seg-1', 'Dough Ball De-Gassing & Palm Flattening', '00:00', 0, '8.0s', 'Dough Intake', 'Finger pressing into fermented dough and spreading it into a round disc.'],
      ['seg-2', 'Bimanual Palm Slap Aeration & Stretch', '00:08', 8, '10.0s', 'Slap & Stretch', 'Rhythmic palm slapping stretches dough into the classic shape.'],
      ['seg-3', 'Water Mist Application to Under-Surface', '00:18', 18, '8.0s', 'Adhesion Prep', 'Applying a thin water film to help the dough contact the hot pan.'],
      ['seg-4', 'High-Heat Griddle Adhesion & Steam Pockets', '00:26', 26, '10.0s', 'Griddle Contact', 'Placing dough on the griddle and observing steam bubble inflation.'],
      ['seg-5', 'Blister Growth Monitoring & Spatula Edge Lift', '00:36', 36, '8.0s', 'Blistering', 'Testing underside adhesion and verifying uniform char spots.'],
      ['seg-6', 'Rapid 180 Degree Inversion & Flame Toasting', '00:44', 44, '7.0s', 'Charring & Flip', 'Inverting the pan or using tongs to expose blisters to flame heat.'],
      ['seg-7', 'Ghee Brushing, Plating & Hearth Removal', '00:51', 51, '4.0s', 'Finishing', 'Brushing ghee across toasted blisters and transferring to serving cloth.'],
    ].map(toSegment),
  },
];

const originDatasets: Dataset[] = ALL_DATASETS.map((dataset) => ({
  ...dataset,
  videoDuration: dataset.videoDuration ?? '01:00',
  segments: dataset.videoSegments ?? [],
}));

const datasets: Dataset[] = originDatasets.length ? originDatasets : sampleDatasets;

function toSegment(row: (string | number)[]): Segment {
  const [id, label, timestamp, timeSeconds, duration, phase, description] = row;
  return {
    id: String(id),
    label: String(label),
    timestamp: String(timestamp),
    timeSeconds: Number(timeSeconds),
    duration: String(duration),
    phase: String(phase),
    description: String(description),
  };
}

export default function MissionDatasets() {
  const [selected, setSelected] = useState<Dataset | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('directory');
  const [payloadFile, setPayloadFile] = useState<PayloadFile>('tasks_action');
  const [toast, setToast] = useState('');
  const related = useMemo(() => {
    if (!selected) return [];
    return datasets.filter((dataset) => dataset.code !== selected.code).slice(0, 3);
  }, [selected]);
  const payload = selected ? getPayload(selected, payloadFile) : '';
  const pythonSnippet = selected ? getPythonSnippet(selected) : '';

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [selected]);

  const openDataset = (dataset: Dataset) => {
    setSelected(dataset);
    setDetailTab('directory');
    setPayloadFile('tasks_action');
  };

  const copyText = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast(message);
    } catch {
      setToast('Copy is not available in this browser context');
    }
    window.setTimeout(() => setToast(''), 2400);
  };

  const scopeCollection = () => {
    setSelected(null);
    window.setTimeout(() => {
      document.getElementById('request')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  return (
    <section className="mission-datasets" id="datasets" aria-labelledby="featured-datasets-title">
      <div className="dataset-showcase shell" id="featured-datasets">
        <div className="dataset-heading">
          <span className="section-index">05 / FEATURED DATASETS</span>
          <h2 id="featured-datasets-title">Featured data captures.</h2>
          <p>
            A compact sample of the task categories and specifications SYRM can collect,
            organize, and review for training pipelines.
          </p>
        </div>

        <div className="dataset-grid">
          {datasets.map((dataset) => (
            <button
              type="button"
              className="dataset-card"
              onClick={() => openDataset(dataset)}
              key={dataset.code}
              aria-label={`View ${dataset.title}`}
            >
              <div className="dataset-thumb">
                <img src={dataset.thumbnail} alt={dataset.title} referrerPolicy="no-referrer" />
                <span>{dataset.code}</span>
              </div>
              <div className="dataset-card-copy">
                <small>{dataset.category}</small>
                <h3>{dataset.title}</h3>
                <p>{dataset.description}</p>
              </div>
              <div className="dataset-card-foot">
                <span>View capture example</span>
                <ArrowUpRight size={16} />
              </div>
            </button>
          ))}
        </div>

        <div className="dataset-proof" aria-label="Dataset delivery properties">
          <div>
            <Database size={18} />
            <span>Structured sessions</span>
          </div>
          <div>
            <Layers size={18} />
            <span>Metadata-ready handoff</span>
          </div>
          <div>
            <ShieldCheck size={18} />
            <span>Reviewed to spec</span>
          </div>
        </div>
      </div>

      {selected && (
        <div className="dataset-modal" role="dialog" aria-modal="true" aria-labelledby="dataset-modal-title">
          {toast && <div className="dataset-toast"><Check size={15} /> {toast}</div>}
          <button
            type="button"
            className="dataset-modal-backdrop"
            aria-label="Close dataset details"
            onClick={() => setSelected(null)}
          />
          <div className="dataset-modal-panel">
            <div className="dataset-modal-head">
              <div>
                <span className="section-index">{selected.code} / {selected.category}</span>
                <h2 id="dataset-modal-title">{selected.title}</h2>
                <p>{selected.description}</p>
              </div>
              <div className="dataset-modal-actions">
                <button
                  type="button"
                  onClick={() => copyText(`${location.origin}${location.pathname}#featured-datasets`, `${selected.code} link copied`)}
                  aria-label="Copy dataset link"
                >
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
                <a href={selected.youtubeUrl} target="_blank" rel="noreferrer">
                  <ExternalLink size={16} />
                  <span>YouTube</span>
                </a>
              </div>
              <button type="button" className="dataset-modal-close" onClick={() => setSelected(null)} aria-label="Close dataset details">
                <X size={20} />
              </button>
            </div>

            <div className="dataset-spec-strip">
              <div><Clock size={15} /><small>Duration</small><strong>{selected.duration}</strong><span>{selected.tasksCount ?? selected.segments.length} Micro-tasks</span></div>
              <div><Video size={15} /><small>Trajectories</small><strong>{selected.trajectoriesCount.toLocaleString()} demos</strong><span>{selected.subjectsCount} Operators</span></div>
              <div><Cpu size={15} /><small>Resolution</small><strong>{selected.fps} FPS / 4K</strong></div>
              <div><HardDrive size={15} /><small>Storage</small><strong>{selected.size.split('•')[0].trim()}</strong><span>{selected.format.split('/')[0]}</span></div>
              <div><Activity size={15} /><small>Sensor Rig</small><strong title={selected.sensor}>{selected.sensor.split(',')[0]}</strong><span>{selected.keySensors?.length ?? 4} Synced Streams</span></div>
              <div><ShieldCheck size={15} /><small>Environment</small><strong>{selected.environment.split('&')[0].trim()}</strong></div>
            </div>

            <div className="dataset-modal-body">
              <DatasetVideoPlayer dataset={selected as unknown as ExtendedDatasetSpec} isDark />
            </div>

            <div className="dataset-detail-tabs" role="tablist" aria-label="Dataset details">
              {[
                ['directory', FolderTree, 'Filesystem Directory Layout'],
                ['modalities', Layers, 'Core Annotation Modalities'],
                ['inspector', Code2, 'Annotation Payload Inspector'],
              ].map(([id, Icon, label]) => (
                <button
                  type="button"
                  role="tab"
                  aria-selected={detailTab === id}
                  className={detailTab === id ? 'active' : ''}
                  key={id as string}
                  onClick={() => setDetailTab(id as DetailTab)}
                >
                  <Icon size={15} />
                  <span>{label as string}</span>
                </button>
              ))}
            </div>

            <div className="dataset-detail-panel">
              {detailTab === 'directory' && (
                <div className="dataset-architecture">
                  <div className="dataset-file-tree">
                    <h3><FolderTree size={17} /> Filesystem Directory Layout</h3>
                    {[
                      [`/${selected.code.toLowerCase()}_packaged_dataset/`, 'ROOT', 'Root Dataset Directory'],
                      ['metadata.json', 'META', 'Rig parameters, human consent, environment spatial bounds'],
                      ['stereo_calibration.json', 'META', 'Intrinsics, extrinsics, distortion coefficients, baseline (65mm)'],
                      ['scene_001_episode_084/raw_stereo_4k.mp4', 'RGB 60FPS', 'Uncompressed 3840x2160 egocentric stereo video'],
                      ['scene_001_episode_084/visualization.mp4', 'OVERLAY', 'Pre-rendered 3D MANO skeleton & 6DoF bounding box verification'],
                      ['scene_001_episode_084/tasks_action.json', 'MICRO-ACTIONS', 'Atomic timestamps, task phase boundaries & bimanual language'],
                      ['scene_001_episode_084/hand_trajectory.csv', 'MANO 21J', '21 3D joint Cartesian coordinates (x,y,z) @ 60Hz per hand'],
                      ['scene_001_episode_084/head_trajectory.csv', '6DoF HEAD', '6DoF head pose quaternions, rotational velocity and translation'],
                      ['scene_001_episode_084/depth_aligned.npz', 'DEPTH', 'Per-frame metric millimeter depth aligned to primary RGB optical axis'],
                      ['scene_001_episode_084/imu_signals.parquet', '1000Hz', 'Dual-wrist 6-axis linear acceleration & angular rate data (<0.8ms jitter)'],
                    ].map(([item, badge, note], index) => (
                      <div key={item} style={{ '--depth': index > 2 ? 2 : index > 0 ? 1 : 0 } as React.CSSProperties}>
                        <span>{badge}</span>
                        <strong>{item}</strong>
                        <small>{note}</small>
                      </div>
                    ))}
                  </div>
                  <div className="dataset-spec-list">
                    <div><small>Status</small><span>{selected.status ?? 'Benchmark Verified'}</span></div>
                    <div><small>License</small><span>{selected.licenseType ?? 'Commercial DaaS'}</span></div>
                    <div><small>Activity Label</small><span>{selected.activityLabel ?? selected.title}</span></div>
                    <div><small>Annotation Fields</small><span>{selected.annotations}</span></div>
                    <div><small>Key Sensors</small><span>{selected.keySensors?.join(', ') ?? selected.sensor}</span></div>
                  </div>
                </div>
              )}

              {detailTab === 'modalities' && (
                <div className="dataset-modalities">
                  {[
                    ['Modality 01 • Temporal', 'tasks_action.json', 'Action Segmentation & Language Descriptions', 'Hierarchical task decomposition dividing every human episode into atomic sub-goals accompanied by dual-hand instructional text.', 'Hardware-timestamped start & end nanoseconds'],
                    ['Modality 02 • Kinematics', 'hand_trajectory.csv', '3D Bimanual Hand Pose (MANO 21-Joints)', 'Sub-millimeter 3D joint coordinates for all 21 joints per hand, wrist 6DoF rotation matrices, fingertip touch contact classification, and estimated tactile grip pressure.', '60Hz continuous trajectory with camera-frame coordinates'],
                    ['Modality 03 • Spatial 6DoF', 'object_cad_6dof.json', '6DoF Object Trajectories & Deformable Mesh', 'Rigid 6DoF oriented bounding boxes for physical tools, polygonal boundary contours for deformable non-rigid objects, and active contact affordance heatmaps.', 'Orientation quaternions, center mass, contact surface'],
                    ['Modality 04 • Multi-Sensor', 'imu_signals.parquet', 'Hardware Sub-Millisecond Sensor Sync', '1000Hz dual-wrist 6-axis IMU streams aligned to 4K RGB video frames with sub-millisecond precision (<0.8ms jitter), eye-gaze fixations, and metric depth.', 'Hardware PTP clock synchronization across all buses'],
                  ].map(([kicker, file, title, text, proof]) => (
                    <article key={file}>
                      <small>{kicker} / {file}</small>
                      <h3>{title}</h3>
                      <p>{text}</p>
                      <strong><Check size={14} /> {proof}</strong>
                    </article>
                  ))}
                </div>
              )}

              {detailTab === 'inspector' && (
                <div className="dataset-inspector">
                  <div className="dataset-inspector-head">
                    <div>
                      <h3>Session payload inspector</h3>
                      <p>Sample payloads generated against the selected dataset specification.</p>
                    </div>
                    <button type="button" onClick={() => copyText(payload, `${payloadFile} copied`)}>
                      <Copy size={15} />
                      <span>Copy Payload</span>
                    </button>
                  </div>
                  <div className="dataset-file-tabs">
                    {[
                      ['tasks_action', 'tasks_action.json'],
                      ['hand_trajectory', 'hand_trajectory.csv'],
                      ['stereo_calibration', 'stereo_calibration.json'],
                    ].map(([id, label]) => (
                      <button
                        type="button"
                        className={payloadFile === id ? 'active' : ''}
                        onClick={() => setPayloadFile(id as PayloadFile)}
                        key={id}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <pre>{payload}</pre>
                </div>
              )}

            </div>

            <div className="dataset-python-block">
              <div className="dataset-inspector">
                <div className="dataset-inspector-head">
                  <div>
                    <h3><Terminal size={17} /> Python API Stream Loader</h3>
                    <p>Loader snippet for streaming normalized episodic batches.</p>
                  </div>
                  <button type="button" onClick={() => copyText(pythonSnippet, 'Python snippet copied')}>
                    <Copy size={15} />
                    <span>Copy Python Snippet</span>
                  </button>
                </div>
                <pre>{pythonSnippet}</pre>
              </div>
            </div>

            <div className="dataset-related-block">
              <div className="dataset-related-head">
                <div>
                  <span className="section-index">RELATED DATASETS</span>
                  <h3>Continue exploring captures.</h3>
                </div>
                <p>Comparable task demonstrations from nearby categories and capture setups.</p>
              </div>
              <div className="dataset-related">
                {related.map((dataset) => (
                  <button type="button" key={dataset.code} onClick={() => openDataset(dataset)}>
                    <img src={dataset.thumbnail} alt={dataset.title} referrerPolicy="no-referrer" />
                    <span>{dataset.category}</span>
                    <strong>{dataset.title}</strong>
                    <small>{dataset.videoDuration} / {dataset.segments.length} segments</small>
                  </button>
                ))}
              </div>
            </div>

            <button type="button" className="dataset-custom-collection" onClick={scopeCollection}>
              <div>
                <span>Custom collection</span>
                <h3>Scope a collection</h3>
                <p>
                  Tell us the tasks, environments, capture setup, and delivery requirements you need.
                  We can scope a collection program around them.
                </p>
              </div>
              <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function getPayload(dataset: Dataset, file: PayloadFile) {
  if (file === 'hand_trajectory') {
    return `timestamp_ns,joint_id,hand,x_cam_mm,y_cam_mm,z_cam_mm,q_w,q_x,q_y,q_z,contact_flag
000000000,WRIST,LEFT,-124.52,82.10,412.30,0.7071,0.0210,-0.0150,0.7067,1
000000000,INDEX_TIP,LEFT,-142.10,118.90,375.40,0.5840,0.4120,-0.1980,0.6690,1
000000000,WRIST,RIGHT,118.40,78.90,408.50,0.7020,-0.0310,0.0180,0.7110,1
000166666,WRIST,LEFT,-124.10,82.40,412.10,0.7070,0.0212,-0.0148,0.7068,1
000166666,WRIST,RIGHT,118.90,79.20,408.20,0.7018,-0.0315,0.0184,0.7112,1`;
  }

  if (file === 'stereo_calibration') {
    return JSON.stringify({
      camera_model: 'pinhole_radial_tangential_stereo',
      resolution: [3840, 2160],
      stereo_baseline_meters: 0.06502,
      left_camera: { fx: 1942.348, fy: 1942.312, cx: 1920.45, cy: 1079.82 },
      right_camera: { fx: 1941.89, fy: 1941.875, cx: 1918.78, cy: 1081.04 },
      imu_to_camera_extrinsic_transform: {
        translation_xyz_m: [0.012, -0.035, 0.042],
        quaternion_wxyz: [0.998, 0.042, -0.021, 0.038],
        time_offset_ns: -120000,
      },
    }, null, 2);
  }

  return JSON.stringify({
    episode_id: `${dataset.code}_ep084`,
    dataset_version: 'v2.4-sync',
    task_goal: dataset.title,
    environment: dataset.environment,
    fps: dataset.fps,
    total_duration_sec: dataset.segments.at(-1)?.timeSeconds ?? 60,
    action_segments: dataset.segments.map((segment, index) => ({
      segment_index: index,
      timestamp: segment.timestamp,
      phase: segment.phase,
      atomic_action: segment.label,
      duration: segment.duration,
      description: segment.description,
    })),
    telemetry_channels: [
      'hand_pose_mano_3d_left',
      'hand_pose_mano_3d_right',
      'object_bounding_box_6dof',
      'imu_angular_velocity',
      'imu_linear_acceleration',
      'contact_pressure_array',
    ],
  }, null, 2);
}

function getPythonSnippet(dataset: Dataset) {
  return `import syrm

dataset = syrm.load_dataset(
    dataset_id="${dataset.code}",
    split="train",
    modalities=["ego_rgb_4k", "hand_pose_mano_3d", "object_cad_6dof", "contact_forces"],
    format="torch"
)

for episode in dataset.stream_episodes(batch_size=32):
    observations, actions, rewards, next_obs = episode
    print(f"Ep {episode.id}: timestep={observations.timestamp_ns}, joint_poses={actions.shape}")`;
}
