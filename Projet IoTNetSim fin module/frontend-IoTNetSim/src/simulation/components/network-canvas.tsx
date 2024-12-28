
import React, {useCallback, useEffect, useRef, useState} from "react";
import ReactFlow, {
    addEdge,
    Background,
    Connection,
    Controls,
    Edge,
    MarkerType,
    Node,
    NodeChange,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import {IoTDeviceNode} from "./iot-device-node";
import {NetworkDeviceNode} from "./network-device-node";
import {SensorNode} from "./sensor-node";
import CryptoJS from "crypto-js";


import {
    Delete,
    DownloadIcon,
    EditIcon,
    FileAudioIcon,
    Folder, FolderOpen,
    Save,
    ScissorsIcon,
    Settings,
    UploadIcon
} from "lucide-react";
import {Button} from "./ui/button";
import {User} from "../app/dashboard/Simulation";

const nodeTypes = {
    iotDevice: IoTDeviceNode,
    networkDevice: NetworkDeviceNode,
    sensor: SensorNode,
};

const initialNodes: Node[] = [
    {
        id: "gateway-1",
        type: "networkDevice",
        data: { label: "Gateway-1", deviceType: "gateway" },
        position: { x: 250, y: 200 },
    },
];

const initialEdges: Edge[] = [];
const secretKey = "HVHJabfjk515vsdbkvj54bcnaBbcjibhJHBVFKyuiv";

const decrypt = (encryptedData) => {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, secretKey); // Use your secret key here
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8); // Convert decrypted to UTF-8 text
    return decryptedText;
};

const getEdgeColor = (protocol: string) => {
    switch (protocol) {
        case "LoRa":
            return "#9333ea";
        case "ZigBee":
            return "#f41b1b";
        case "NB-IoT":
            return "#3b82f6";
        default:
            return "#1fba1c";
    }
};

interface NetworkCanvasProps {
    protocol: string;
    simulation: boolean;
    user: User | null;
}

export function NetworkCanvas({ protocol, simulation, user}: NetworkCanvasProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});
    const [hoveredEdgeProtocol, setHoveredEdgeProtocol] = useState<string | null>(null);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    const updateNodePositions = useCallback((changes: NodeChange[]) => {
        const updatedPositions = { ...nodePositions };

        changes.forEach((change) => {
            if (change.type === "position" && change.position) {
                updatedPositions[change.id] = change.position;
            }
        });

        setNodePositions(updatedPositions);
    }, [nodePositions]);

    const handleNodesChange = useCallback(
        (changes: NodeChange[]) => {
            onNodesChange(changes);
            updateNodePositions(changes);
        },
        [onNodesChange, updateNodePositions]
    );

    // Add a modal or input for distance when creating an edge
    const onConnect = useCallback(
        (params: Connection) => {
            const distance = prompt("Enter distance for this edge:", "0"); // Prompt for distance
            const unit = prompt("Enter unit (cm, dm, m, km):", "m"); // Prompt for unit
            if (distance !== null && unit !== null) {
                let distanceInMeters = parseFloat(distance) || 0;

                // Convert the distance to meters based on the selected unit
                switch (unit.toLowerCase()) {
                    case "cm":
                        distanceInMeters /= 100;
                        break;
                    case "dm":
                        distanceInMeters /= 10;
                        break;
                    case "km":
                        distanceInMeters *= 1000;
                        break;
                    case "m":
                    default:
                        break;
                }

                const edge = {
                    ...params,
                    id: `e${params.source}-${params.target}`,
                    type: "custom",
                    style: { stroke: getEdgeColor(protocol) },
                    label: `${distanceInMeters} m`, // Show distance in meters as label
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: getEdgeColor(protocol),
                    },
                    data: { protocol, distance: distanceInMeters }, // Store distance in meters
                };
                const newEdges = addEdge(edge, edges);
                setEdges(newEdges);
            }
        },
        [edges, protocol, setEdges]
    );


    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            let type = event.dataTransfer.getData("application/reactflow");
            let typeCapt = null;
            const name = event.dataTransfer.getData("application/reactflow-name");
            const icon = event.dataTransfer.getData("application/reactflow-icon");

            const position = {
                x: event.clientX,
                y: event.clientY,
            };

            if(type != "networkDevice" && type != "iotDevice") {
                typeCapt = type;
                type = "sensor";
            }

            const newNode = {
                id: `${type}  -${nodes.length + 1}`,
                type,
                position,
                data: {
                    label: `${name}-${nodes.length + 1}`,
                    type: `${typeCapt}`,
                    deviceType: type,
                    protocol,
                    icon,
                },
            };

            const newNodes = nodes.concat(newNode);
            setNodes(newNodes);
        },
        [nodes, protocol, setNodes]
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const previousProtocol = useRef(protocol);

    useEffect(() => {
        if (previousProtocol.current !== protocol) {
            previousProtocol.current = protocol;
            setNodes(initialNodes);
            setEdges(initialEdges);
            setNodePositions({});
        }
    }, [protocol]);

    const onEdgeMouseEnter = (event: React.MouseEvent, edge: Edge) => {
        setHoveredEdgeProtocol(edge.data.protocol);
    };

    const onEdgeMouseLeave = () => {
        setHoveredEdgeProtocol(null);
    };

    // Handle removing a node
    const handleRemoveNode = (nodeId: string) => {
        const newNodes = nodes.filter((node) => node.id !== nodeId);
        setNodes(newNodes);
        setSelectedNode(null);  // Close the Node Actions popup when the node is deleted
    };

    // Handle editing node
    const handleEditNode = (nodeId: string) => {
        const newLabel = prompt("Enter new label:", "");
        if (newLabel) {
            const newNodes = nodes.map((node) =>
                node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
            );
            setNodes(newNodes);
        }
    };

    // Handle export topology
    const handleExportTopology = () => {
        const topology = {
            nodes: nodes.map((node) => ({
                id: node.id,
                type: node.type,
                position: node.position,
                data: node.data,
            })),
            edges: edges.map((edge) => ({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                type: edge.type,
                distance : edge.data.distance || 0,
                data: { ...edge.data, distance: edge.data.distance || 0 }, // Include distance
            })),
            protocol,
        };
        console.log(JSON.stringify(topology, null, 2));
    };


    // Handle copying a node
    const handleCopyNode = (nodeId: string) => {
        const nodeToCopy = nodes.find((node) => node.id === nodeId);
        if (nodeToCopy) {
            const copiedNode = {
                ...nodeToCopy,
                id: `${nodeId}-copy`,
                position: { x: nodeToCopy.position.x + 50, y: nodeToCopy.position.y + 50 }
            };
            const newNodes = [...nodes, copiedNode];
            setNodes(newNodes);
        }
    };

    const handleNodeClick = (node: Node) => {
        setSelectedNode(node);
    };


    const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
        const distance = prompt("Enter distance for this edge:", edge.data?.distance || "0"); // Prompt for distance
        const unit = prompt("Enter unit (cm, dm, m, km):", "m"); // Prompt for unit
        if (distance !== null && unit !== null) {
            let distanceInMeters = parseFloat(distance) || 0;

            // Convert the distance to meters based on the selected unit
            switch (unit.toLowerCase()) {
                case "cm":
                    distanceInMeters /= 100; // Convert cm to meters
                    break;
                case "dm":
                    distanceInMeters /= 10;  // Convert dm to meters
                    break;
                case "km":
                    distanceInMeters *= 1000; // Convert km to meters
                    break;
                case "m":
                default:
                    break; // No conversion needed for meters
            }

            const updatedEdges = edges.map((e) =>
                e.id === edge.id
                    ? {
                        ...e,
                        data: { ...e.data, distance: distanceInMeters },
                        label: `${distanceInMeters} m`, // Update the label with distance in meters
                    }
                    : e
            );

            setEdges(updatedEdges); // Update the edges state
        }
    };



    // Detect Backspace key press for node removal
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Backspace" && selectedNode) {
                handleRemoveNode(selectedNode.id);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedNode]);


    useEffect(() => {
        if (simulation) {
            const intervalId = setInterval(() => {
                const topology = {
                    nodes: nodes.map((node) => ({
                        id: node.id,
                        type: node.type,
                        position: node.position,
                        data: node.data,
                    })),
                    edges: edges.map((edge) => ({
                        id: edge.id,
                        source: edge.source,
                        target: edge.target,
                        type: edge.type,
                        distance : edge.data.distance || 0,
                        data: { ...edge.data, distance: edge.data.distance || 0 }, // Include distance
                    })),
                    protocol,
                };

                fetch('http://localhost:8080/api/network', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(topology, null, 2),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log('Topology data successfully sent:', data);
                    })
                    .catch((error) => {
                        console.error('Error sending topology data:', error);
                    });
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, [simulation, nodes, edges, protocol]);


    const saveTemplateToFile = () => {
        // Create the template object
        const template = {
            nodes: nodes.map((node) => ({
                ...node,
                position: { ...node.position },
            })),
            edges: edges.map((edge) => ({
                ...edge,
            })),
            user: user,
        };

        // Convert the template to a JSON string
        const jsonString = JSON.stringify(template, null, 2);

        // Encrypt the JSON string using AES encryption
        const encrypted = CryptoJS.AES.encrypt(jsonString, secretKey).toString();

        // Convert the encrypted string to a Blob (binary format)
        const blob = new Blob([encrypted], { type: "application/octet-stream" });

        // Create a download link for the encrypted file
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `flow-template-${user.username}.isic2ay`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const loadTemplateFromFile = (event) => {
        const fileInput = event.target; // Reference to the input element
        const file = fileInput.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;

                try {
                    let templateContent;

                    // Check if the file is encrypted (based on file extension)
                    if (file.name.endsWith('.isic2ay')) {
                        // Decrypt the content if it's an encrypted file
                        const decryptedContent = decrypt(content); // You need to implement the decrypt function
                        templateContent = JSON.parse(decryptedContent); // Parse the decrypted content
                    } else {
                        // If it's not encrypted, directly parse the content
                        templateContent = JSON.parse(content);
                    }

                    // Validate user data
                    if (user.email !== templateContent.user.email || user.password !== templateContent.user.password) {
                        alert(`This template is for user ${templateContent.user.username}`);
                        throw new Error("Invalid user");
                    }

                    // Set the nodes and edges after validating
                    setNodes(templateContent.nodes || []);
                    setEdges(templateContent.edges || []);
                    alert("Template loaded successfully!");
                } catch (error) {
                    alert("Invalid or corrupted file format!");
                }

                // Reset the input value to allow reloading the same file
                fileInput.value = "";
            };

            reader.readAsText(file); // Read the file content
        }
    };



    return (
        <ReactFlowProvider>
            <div className="h-full w-full relative">
                <Button
                    variant="ghost"
                    size="icon"
                    title="Template as JSON (console)"
                    onClick={() => handleExportTopology()}
                    className="hover:bg-[#d4d4d4]"
                >
                    <UploadIcon className="h-4 w-4 text-gray-700"/>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    title="Save Template"
                    onClick={saveTemplateToFile}
                    className="hover:bg-[#d4d4d4]"
                >
                    <Save className="h-4 w-4 text-gray-700"/>
                </Button>


                <Button
                    variant="ghost"
                    size="icon"
                    title="Open Template"
                    onClick={() => document.getElementById('file-input').click()}
                    className="hover:bg-[#d4d4d4]"
                >
                    <FolderOpen className="h-4 w-4 text-gray-700"/>
                </Button>

                <input
                    id="file-input"
                    type="file"
                    accept=".isic2ay"  // Accept both .json and encrypted .enc files
                    className="hidden"   // Hide the default input
                    onChange={loadTemplateFromFile}
                />


                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={handleNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    nodeTypes={nodeTypes}
                    onEdgeClick={onEdgeClick}
                    fitView
                    onEdgeMouseEnter={onEdgeMouseEnter}
                    onEdgeMouseLeave={onEdgeMouseLeave}
                    onNodeClick={(event, node) => handleNodeClick(node)}  // Add click handler here
                >
                    <Background color="#aaa" gap={16}/>
                    <Controls/>
                </ReactFlow>

                {hoveredEdgeProtocol && (
                    <div
                        className="absolute p-2 text-white font-semibold rounded-md"
                        style={{
                            bottom: "10px",
                            right: "10px",
                            backgroundColor: getEdgeColor(hoveredEdgeProtocol),
                            zIndex: 1000,
                        }}
                    >
                        <p>Protocol: {hoveredEdgeProtocol}</p>
                    </div>
                )}

                {/* Node Actions Popup */}
                {selectedNode && (
                    <div className="absolute bottom-0 right-0 p-4 bg-white shadow-md border-t-2 border-gray-300 w-200">
                        <h3 className="text-sm font-semibold mb-2">Node Actions: {selectedNode.data.label}</h3>

                        <Button
                            variant="ghost"
                            size="icon"
                            title="Delete Node"
                            onClick={() => handleRemoveNode(selectedNode.id)}
                            className="hover:bg-[#d4d4d4]"
                        >
                            <Delete className="h-4 w-4 text-gray-700"/>
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            title="Edit Node"
                            onClick={() => handleEditNode(selectedNode.id)}
                            className="hover:bg-[#d4d4d4]"
                        >
                            <EditIcon className="h-4 w-4 text-gray-700"/>
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            title="Copy/Paste Node"
                            onClick={() => handleCopyNode(selectedNode.id)}
                            className="hover:bg-[#d4d4d4]"
                        >
                            <ScissorsIcon className="h-4 w-4 text-gray-700"/>
                        </Button>
                    </div>
                )}
            </div>
        </ReactFlowProvider>
    );
}
